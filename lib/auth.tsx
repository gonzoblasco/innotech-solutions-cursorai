"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import supabase from './supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: Omit<Profile, 'id' | 'created_at' | 'email'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario y perfil al montar
  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError('Error obteniendo la sesión.');
        setLoading(false);
        return;
      }
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };
    getSession();
    // Suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Función para obtener el perfil
  const fetchProfile = async (user: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      setError('No se pudo cargar el perfil.');
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
  };

  // Registro de usuario y creación de perfil
  const signUp = async (email: string, password: string, userData: Omit<Profile, 'id' | 'created_at' | 'email'>) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setError(mapAuthError(error?.message));
      setLoading(false);
      return;
    }
    // Crear perfil
    const { error: profileError } = await supabase.from('profiles').insert({
      ...userData,
      id: data.user.id,
      email,
    });
    if (profileError) {
      setError('Usuario creado, pero hubo un error creando el perfil.');
    } else {
      await fetchProfile(data.user);
    }
    setUser(data.user);
    setLoading(false);
  };

  // Login básico
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setError(mapAuthError(error?.message));
      setLoading(false);
      return;
    }
    setUser(data.user);
    await fetchProfile(data.user);
    setLoading(false);
  };

  // Login con Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setError(mapAuthError(error.message));
    }
    setLoading(false);
  };

  // Cerrar sesión
  const signOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('No se pudo cerrar la sesión.');
    }
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  // Actualizar perfil
  const updateProfile = async (data: Partial<Omit<Profile, 'id' | 'created_at' | 'email'>>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
    if (error) {
      setError('No se pudo actualizar el perfil.');
    } else {
      await fetchProfile(user);
    }
    setLoading(false);
  };

  // Mapeo de errores de Supabase Auth a español
  function mapAuthError(message?: string): string {
    if (!message) return 'Error desconocido.';
    if (message.includes('Invalid login credentials')) return 'Credenciales inválidas.';
    if (message.includes('User already registered')) return 'El usuario ya está registrado.';
    if (message.includes('Email not confirmed')) return 'Debes confirmar tu correo electrónico.';
    if (message.includes('Password should be at least')) return 'La contraseña es demasiado corta.';
    if (message.includes('rate limit')) return 'Demasiados intentos, espera un momento.';
    return message;
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
} 