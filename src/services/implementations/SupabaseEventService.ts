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
                    dataInscricao: reg.data_inscricao
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
                    dataInscricao: reg.data_inscricao
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

    async registerSubscriber(eventoId: string, inscritoData: Omit<Inscrito, 'id' | 'dataInscricao'>): Promise<void> {
        if (!supabase) throw new Error('Supabase não configurado.');
        const { error } = await supabase
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
                curso: inscritoData.cursoInteresse
            }]);

        if (error) throw error;
    }

    isAdmin(): boolean {
        return false;
    }

    setAdmin(_isAdmin: boolean): void {
    }
}
