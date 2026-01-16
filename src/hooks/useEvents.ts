import { useState, useEffect } from 'react';
import { Evento, Inscrito } from '../types';
import { eventService } from '../services/factory';
import { authService } from '../services/auth';

export const useStore = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false); // ✅ NEW: Auth initialization state

  const loadEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  // ✅ CRITICAL: Single source of truth for auth initialization
  useEffect(() => {
    let subscription: any;
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('[AUTH] Starting authentication initialization...');

        // STEP 1: Wait for session to be fully resolved
        const session = await authService.getSession();

        if (!mounted) return;

        // STEP 2: Set admin state based on session
        setIsAdmin(!!session);
        console.log('[AUTH] Session resolved:', !!session);

        // STEP 3: Mark auth as ready BEFORE loading data
        setAuthReady(true);
        console.log('[AUTH] Auth system ready');

        // STEP 4: Setup auth state listener
        const { data } = authService.onAuthStateChange((newSession) => {
          if (!mounted) return;
          setIsAdmin(!!newSession);
          console.log('[AUTH] Auth state changed:', !!newSession);
        });

        subscription = data?.subscription;
      } catch (e) {
        console.error('[AUTH] Error during initialization:', e);
        // Even on error, mark as ready to prevent infinite loading
        if (mounted) setAuthReady(true);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // ✅ Run only once on mount

  // ✅ CRITICAL: Load events ONLY after auth is ready
  useEffect(() => {
    if (!authReady) {
      console.log('[DATA] Waiting for auth to be ready...');
      return;
    }

    console.log('[DATA] Auth ready, loading events...');
    loadEvents();
  }, [authReady]); // ✅ Dependency on authReady ensures proper sequence

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

  const deleteEvento = async (id: string) => {
    await eventService.deleteEvent(id);
    await loadEvents();
  };

  const updateEvento = async (evento: Evento) => {
    await eventService.updateEvent(evento);
    await loadEvents();
  };

  const registrarInscrito = async (eventoId: string, inscrito: Omit<Inscrito, 'id' | 'dataInscricao'>) => {
    const result = await eventService.registerSubscriber(eventoId, inscrito);
    await loadEvents();
    return result;
  };

  const deleteInscrito = async (id: string) => {
    await eventService.deleteRegistration(id);
    await loadEvents();
  };

  const validateCheckin = async (token: string) => {
    const result = await eventService.validateCheckin(token);
    if (result.success) {
      await loadEvents();
    }
    return result;
  };

  const uploadImage = async (file: File) => {
    return await eventService.uploadImage(file);
  };

  return {
    eventos,
    isAdmin,
    authReady, // ✅ NEW: Expose authReady to components
    login,
    logout,
    addEvento,
    updateEvento,
    encerrarEvento,
    deleteEvento,
    registrarInscrito,
    deleteInscrito,
    validateCheckin,
    uploadImage
  };
};
