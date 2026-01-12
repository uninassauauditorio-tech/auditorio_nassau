import { supabase } from '../../lib/supabase';
import { Evento, Inscrito } from '../../types';
import { EventService } from '../interfaces/EventService';

export class SupabaseEventService implements EventService {
    async getEvents(): Promise<Evento[]> {
        if (!supabase) return [];
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*, registrations(*)')
                .order('data_evento', { ascending: false });

            if (error) throw error;

            return (data || []).map((event: any) => ({
                id: event.id,
                nome: event.nome_evento,
                data: event.data_evento,
                horario: event.horario_evento || '00:00',
                descricao: event.descricao || '',
                local: event.local,
                encerrado: event.status === 'encerrado',
                imagem: event.imagem_url,
                inscritos: (event.registrations || []).map((reg: any) => ({
                    id: reg.id,
                    nomeCompleto: reg.nome,
                    telefone: reg.telefone,
                    cpf: reg.cpf,
                    email: reg.email,
                    escolaridade: reg.escolaridade,
                    interesseGraduacao: reg.interesse === 'graduacao' ? 'Sim' : 'Não',
                    interesseTipo: reg.interesse,
                    cursoInteresse: reg.curso,
                    dataInscricao: reg.data_inscricao,
                    qrToken: reg.qr_token,
                    checkedIn: reg.checked_in,
                    checkinDate: reg.checkin_date
                }))
            }));
        } catch (e) {
            console.error('Erro ao buscar eventos:', e);
            return [];
        }
    }

    async getEventById(id: string): Promise<Evento | undefined> {
        if (!supabase) return undefined;
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*, registrations(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return undefined;

            return {
                id: data.id,
                nome: data.nome_evento,
                data: data.data_evento,
                horario: data.horario_evento || '00:00',
                descricao: data.descricao || '',
                local: data.local,
                encerrado: data.status === 'encerrado',
                imagem: data.imagem_url,
                inscritos: (data.registrations || []).map((reg: any) => ({
                    id: reg.id,
                    nomeCompleto: reg.nome,
                    telefone: reg.telefone,
                    cpf: reg.cpf,
                    email: reg.email,
                    escolaridade: reg.escolaridade,
                    interesseGraduacao: reg.interesse === 'graduacao' ? 'Sim' : 'Não',
                    interesseTipo: reg.interesse,
                    cursoInteresse: reg.curso,
                    dataInscricao: reg.data_inscricao,
                    qrToken: reg.qr_token,
                    checkedIn: reg.checked_in,
                    checkinDate: reg.checkin_date
                }))
            };
        } catch (e) {
            console.error('Erro ao buscar evento por ID:', e);
            return undefined;
        }
    }

    async createEvent(eventoData: Omit<Evento, 'id' | 'inscritos' | 'encerrado'>): Promise<Evento> {
        if (!supabase) throw new Error('Supabase não configurado.');
        const { data, error } = await supabase
            .from('events')
            .insert([{
                nome_evento: eventoData.nome,
                descricao: eventoData.descricao,
                data_evento: eventoData.data,
                horario_evento: eventoData.horario,
                local: eventoData.local,
                imagem_url: (eventoData as any).imagem,
                status: 'ativo'
            }])
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            nome: data.nome_evento,
            data: data.data_evento,
            horario: data.horario_evento || '00:00',
            descricao: data.descricao || '',
            local: data.local,
            encerrado: false,
            imagem: data.imagem_url,
            inscritos: []
        };
    }

    async updateEvent(evento: Evento): Promise<Evento> {
        if (!supabase) throw new Error('Supabase não configurado.');
        const { data, error } = await supabase
            .from('events')
            .update({
                nome_evento: evento.nome,
                descricao: evento.descricao,
                data_evento: evento.data,
                horario_evento: evento.horario,
                local: evento.local,
                imagem_url: evento.imagem,
                status: evento.encerrado ? 'encerrado' : 'ativo'
            })
            .eq('id', evento.id)
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            nome: data.nome_evento,
            data: data.data_evento,
            horario: data.horario_evento || '00:00',
            descricao: data.descricao || '',
            local: data.local,
            encerrado: data.status === 'encerrado',
            imagem: data.imagem_url,
            inscritos: evento.inscritos
        };
    }

    async closeEvent(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase não configurado.');
        const { error } = await supabase
            .from('events')
            .update({ status: 'encerrado' })
            .eq('id', id);

        if (error) throw error;
    }

    async deleteEvent(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase não configurado.');
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async registerSubscriber(eventoId: string, inscritoData: Omit<Inscrito, 'id' | 'dataInscricao'>): Promise<Inscrito> {
        if (!supabase) throw new Error('Supabase não configurado.');

        const qrToken = crypto.randomUUID();

        const { data, error } = await supabase
            .from('registrations')
            .insert([{
                event_id: eventoId,
                nome: inscritoData.nomeCompleto,
                cpf: inscritoData.cpf,
                telefone: inscritoData.telefone,
                email: inscritoData.email,
                escolaridade: inscritoData.escolaridade,
                interesse: inscritoData.interesseTipo === 'Pós-graduação' ? 'pos' :
                    inscritoData.interesseTipo === 'Segunda Graduação' ? 'segunda_graduacao' : 'graduacao',
                curso: inscritoData.cursoInteresse,
                qr_token: qrToken
            }])
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            nomeCompleto: data.nome,
            telefone: data.telefone,
            cpf: data.cpf,
            email: data.email,
            escolaridade: data.escolaridade,
            interesseGraduacao: data.interesse === 'graduacao' ? 'Sim' : 'Não',
            interesseTipo: data.interesse,
            cursoInteresse: data.curso,
            dataInscricao: data.data_inscricao,
            qrToken: data.qr_token,
            checkedIn: data.checked_in,
            checkinDate: data.checkin_date
        };
    }

    async validateCheckin(token: string): Promise<{ success: boolean; message: string; inscrito?: Inscrito }> {
        if (!supabase) throw new Error('Supabase não configurado.');

        try {
            const { data: inscrito, error: fetchError } = await supabase
                .from('registrations')
                .select('*, events(nome_evento)')
                .eq('qr_token', token)
                .single();

            if (fetchError || !inscrito) {
                return { success: false, message: 'QR Code inválido ou não encontrado.' };
            }

            if (inscrito.checked_in) {
                return {
                    success: false,
                    message: 'Este QR Code já foi utilizado para check-in.',
                    inscrito: {
                        id: inscrito.id,
                        nomeCompleto: inscrito.nome,
                        telefone: inscrito.telefone,
                        cpf: inscrito.cpf,
                        email: inscrito.email,
                        escolaridade: inscrito.escolaridade,
                        dataInscricao: inscrito.data_inscricao,
                        qrToken: inscrito.qr_token,
                        checkedIn: inscrito.checked_in,
                        checkinDate: inscrito.checkin_date
                    }
                };
            }

            const { data: updated, error: updateError } = await supabase
                .from('registrations')
                .update({
                    checked_in: true,
                    checkin_date: new Date().toISOString()
                })
                .eq('id', inscrito.id)
                .select()
                .single();

            if (updateError) throw updateError;

            return {
                success: true,
                message: 'Entrada confirmada com sucesso!',
                inscrito: {
                    id: updated.id,
                    nomeCompleto: updated.nome,
                    telefone: updated.telefone,
                    cpf: updated.cpf,
                    email: updated.email,
                    escolaridade: updated.escolaridade,
                    dataInscricao: updated.data_inscricao,
                    qrToken: updated.qr_token,
                    checkedIn: updated.checked_in,
                    checkinDate: updated.checkin_date
                }
            };
        } catch (e) {
            console.error('Erro na validação de check-in:', e);
            return { success: false, message: 'Erro ao processar check-in. Tente novamente.' };
        }
    }

    async uploadImage(file: File): Promise<string> {
        if (!supabase) throw new Error('Supabase não configurado.');

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('imagem eventos')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('imagem eventos')
            .getPublicUrl(filePath);

        return publicUrl;
    }

    isAdmin(): boolean {
        return false;
    }

    setAdmin(_isAdmin: boolean): void {
    }
}
