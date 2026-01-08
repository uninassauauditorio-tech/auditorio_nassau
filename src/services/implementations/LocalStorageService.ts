import { Evento, Inscrito } from '../../types';
import { EventService } from '../interfaces/EventService';

const STORAGE_KEY = 'uninassau_eventos_v1';
const ADMIN_KEY = 'is_admin';

export class LocalStorageService implements EventService {
    async getEvents(): Promise<Evento[]> {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);

        // Initial Seed Data
        const initialData: Evento[] = [
            {
                id: '1',
                nome: 'Workshop de Inovação Tecnológica e IA',
                data: '2025-01-09',
                horario: '14:00 - 18:00',
                descricao: 'Um encontro exclusivo para discutir o futuro da tecnologia aplicada aos negócios. Garanta sua vaga preenchendo o formulário.',
                local: 'Auditório UNINASSAU Olinda',
                encerrado: false,
                inscritos: []
            }
        ];
        this.saveEventsInternal(initialData);
        return initialData;
    }

    async getEventById(id: string): Promise<Evento | undefined> {
        const events = await this.getEvents();
        return events.find(e => e.id === id);
    }

    async createEvent(eventoData: Omit<Evento, 'id' | 'inscritos' | 'encerrado'>): Promise<Evento> {
        const events = await this.getEvents();
        const newEvent: Evento = {
            ...eventoData,
            id: Math.random().toString(36).substr(2, 9),
            inscritos: [],
            encerrado: false
        };

        events.unshift(newEvent);
        this.saveEventsInternal(events);
        return newEvent;
    }

    async updateEvent(evento: Evento): Promise<Evento> {
        const events = await this.getEvents();
        const index = events.findIndex(e => e.id === evento.id);
        if (index !== -1) {
            events[index] = evento;
            this.saveEventsInternal(events);
        }
        return evento;
    }

    async closeEvent(id: string): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.map(e => e.id === id ? { ...e, encerrado: true } : e);
        this.saveEventsInternal(updatedEvents);
    }

    async registerSubscriber(eventoId: string, inscritoData: Omit<Inscrito, 'id' | 'dataInscricao'>): Promise<void> {
        const events = await this.getEvents();
        const updatedEvents = events.map(e => {
            if (e.id === eventoId) {
                const newInscrito: Inscrito = {
                    ...inscritoData,
                    id: Math.random().toString(36).substr(2, 9),
                    dataInscricao: new Date().toISOString()
                };
                return { ...e, inscritos: [...e.inscritos, newInscrito] };
            }
            return e;
        });
        this.saveEventsInternal(updatedEvents);
    }

    isAdmin(): boolean {
        return localStorage.getItem(ADMIN_KEY) === 'true';
    }

    setAdmin(isAdmin: boolean): void {
        if (isAdmin) {
            localStorage.setItem(ADMIN_KEY, 'true');
        } else {
            localStorage.removeItem(ADMIN_KEY);
        }
    }

    private saveEventsInternal(events: Evento[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
}
