import { supabase } from '../lib/supabase';

export const authService = {
    async login(email: string, password: string) {
        if (!supabase) throw new Error('Supabase não configurado.');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    async loginWithEmail(email: string, password: string) {
        if (!supabase) throw new Error('Supabase não configurado.');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    async logout() {
        if (!supabase) return;
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (e) {
            console.error('Erro ao fazer logout:', e);
        }
    },

    async getSession() {
        if (!supabase) return null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (e) {
            console.error('Erro ao obter sessão:', e);
            return null;
        }
    },

    onAuthStateChange(callback: (session: any) => void) {
        if (!supabase) return { data: { subscription: { unsubscribe: () => { } } } };
        try {
            return supabase.auth.onAuthStateChange((_event, session) => {
                callback(session);
            });
        } catch (e) {
            console.error('Erro ao ouvir mudanças de auth:', e);
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    }
};
