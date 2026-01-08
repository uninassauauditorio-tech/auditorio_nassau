import { Evento, Inscrito } from '../../types';

export interface EventService {
    getEvents(): Promise<Evento[]>;
    getEventById(id: string): Promise<Evento | undefined>;
    createEvent(evento: Omit<Evento, 'id' | 'inscritos' | 'encerrado'>): Promise<Evento>;
    updateEvent(evento: Evento): Promise<Evento>;
    closeEvent(id: string): Promise<void>;
    registerSubscriber(eventoId: string, inscrito: Omit<Inscrito, 'id' | 'dataInscricao'>): Promise<void>;
    isAdmin(): boolean;
    setAdmin(isAdmin: boolean): void;
}
