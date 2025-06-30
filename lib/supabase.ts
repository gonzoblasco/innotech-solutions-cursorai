import { createClientComponentClient as createClient, createServerComponentClient as createServer, createRouteHandlerClient as createRoute } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Tipos para la tabla profiles
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  api_usage_current: number;
  api_quota: number;
  country: string | null;
  created_at: string;
}

// Configuración de Supabase según entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Falta configuración de Supabase: revisa las variables de entorno.');
  }
}

// Cliente principal tipado
const supabase: SupabaseClient<Database> = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

// Helpers para Next.js App Router
export function createClientComponentClient() {
  try {
    return createClient<Database>();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error creando Supabase Client Component:', error);
    }
    throw error;
  }
}

export function createServerComponentClient(ctx?: any) {
  try {
    return createServer<Database>({ cookies: () => ctx?.cookies });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error creando Supabase Server Component:', error);
    }
    throw error;
  }
}

export function createRouteHandlerClient(ctx?: any) {
  try {
    return createRoute<Database>({ cookies: () => ctx?.cookies });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error creando Supabase Route Handler:', error);
    }
    throw error;
  }
}

export default supabase; 