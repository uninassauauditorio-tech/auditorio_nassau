import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Create client only if credentials exist to avoid crashing the app
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any; // Cast to any to avoid type errors in other files, but it will throw if used
