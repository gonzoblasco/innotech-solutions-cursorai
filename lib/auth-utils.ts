import supabase from './supabase';
import type { Profile } from '@/types/database';
import { useAuth } from './auth';

export async function isAuthenticated() {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
}

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) return null;
  return data as Profile;
}

export function redirectToLogin(redirect?: string) {
  window.location.href = `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`;
}

// HOC para envolver componentes que requieren auth (client-side)
export function withAuth<P extends { user: any; profile: any }>(Component: React.ComponentType<P>) {
  return function Wrapper(props: Omit<P, 'user' | 'profile'>) {
    const { user, profile, loading } = useAuth();
    if (loading) return <div className="w-full flex justify-center items-center py-12 text-primary">Cargando...</div>;
    if (!user) {
      if (typeof window !== 'undefined') redirectToLogin(window.location.pathname);
      return null;
    }
    return <Component {...(props as P)} user={user} profile={profile} />;
  };
} 