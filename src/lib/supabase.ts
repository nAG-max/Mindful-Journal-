import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables are missing! The app will not function correctly. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
