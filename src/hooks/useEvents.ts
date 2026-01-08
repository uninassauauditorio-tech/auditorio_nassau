import { useState, useEffect } from 'react';
import { Evento, Inscrito } from '../types';
import { eventService } from '../services/factory';
import { authService } from '../services/auth';

export const useStore = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  useEffect(() => {
    let subscription: any;

    const init = async () => {
      try {
        await loadEvents();

        // Check initial session
        const session = await authService.getSession();
        setIsAdmin(!!session);

        // Listen for auth changes
        const { data } = authService.onAuthStateChange((session) => {
          setIsAdmin(!!session);
        });

        subscription = data?.subscription;
      } catch (e) {
        console.error('Erro na inicialização do store:', e);
      }
    };

    init();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = () => {
    // Login logic is now handled in AdminLogin.tsx via authService
    setIsAdmin(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsAdmin(false);
  };

  const addEvento = async (evento: Omit<Evento, 'id' | 'inscritos' | 'encerrado'>) => {
    await eventService.createEvent(evento);
    await loadEvents();
  };

  const encerrarEvento = async (id: string) => {
    await eventService.closeEvent(id);
    await loadEvents();
  };

  const updateEvento = async (evento: Evento) => {
    await eventService.updateEvent(evento);
    await loadEvents();
  };

  const registrarInscrito = async (eventoId: string, inscrito: Omit<Inscrito, 'id' | 'dataInscricao'>) => {
    await eventService.registerSubscriber(eventoId, inscrito);
    await loadEvents();
  };

  return {
    eventos,
    isAdmin,
    login,
    logout,
    addEvento,
    updateEvento,
    encerrarEvento,
    registrarInscrito
  };
};
