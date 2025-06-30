// Actualizar AgentCard.tsx para pasar las cookies correctamente

'use client';
import React, { useState } from 'react';
import { Star, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function AgentCard({ agent, onPreview }: { agent: any, onPreview: (agent: any) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async () => {
    setLoading(true);
    console.log('🎯 Starting conversation for agent:', agent.name);
    
    try {
      // 1. Verificar autenticación
      console.log('🔍 Checking authentication...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        alert(`Error de sesión: ${sessionError.message}`);
        setLoading(false);
        return;
      }

      if (!session) {
        console.log('❌ No session found');
        alert('No estás autenticado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      console.log('✅ Session found:', {
        user: session.user.email,
        expires: session.expires_at
      });

      // 2. Crear conversación con headers de autenticación
      console.log('🚀 Creating conversation...');
      
      // Obtener todas las cookies para pasarlas al servidor
      const allCookies = document.cookie;
      console.log('🍪 Sending cookies:', allCookies ? 'Present' : 'Missing');

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'Cookie': allCookies, // Pasar todas las cookies
        },
        credentials: 'include', // Importante: incluir cookies
        body: JSON.stringify({
          agentType: agent.id,
          title: `Conversación con ${agent.name}`
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📡 Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const conversation = JSON.parse(responseText);
      console.log('✅ Conversation created:', conversation);
      
      // Redirigir al chat
      router.push(`/dashboard/chat/${conversation.id}?agent=${agent.id}`);
      
    } catch (error) {
      console.error('💥 Error starting conversation:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col p-4 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all animate-fade-in group">
      {/* Estado */}
      {agent.available ? (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />Disponible
        </span>
      ) : (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <Loader2 className="w-4 h-4 animate-spin" />Ocupado
        </span>
      )}
      
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {agent.icon ? <agent.icon className="w-7 h-7" /> : agent.name[0]}
        </div>
        <div>
          <div className="font-bold text-lg text-primary">{agent.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{agent.specialty || agent.category}</div>
        </div>
      </div>
      
      {/* Descripción */}
      <div className="text-sm text-gray-700 dark:text-gray-200 mb-2 line-clamp-3">{agent.description}</div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {agent.capabilities?.map((cap: string) => (
          <span key={cap} className="px-2 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-xs text-primary font-medium">{cap}</span>
        ))}
      </div>
      
      {/* Plan badge */}
      <span className={
        'inline-block mb-2 px-2 py-0.5 rounded text-xs font-semibold ' +
        (agent.planRequired === 'free' ? 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200' :
         agent.planRequired === 'premium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200' :
         'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200')
      }>
        {agent.planRequired === 'free' ? 'Free' : agent.planRequired === 'premium' ? 'Premium' : 'Enterprise'}
      </span>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className={
            'w-4 h-4 ' + (agent.rating >= i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600')
          } />
        ))}
        <span className="text-xs text-gray-500 ml-1">{agent.rating}</span>
      </div>
      
      {/* Botón */}
      <button
        className="mt-auto px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        onClick={handleStartConversation}
        disabled={loading || !agent.available}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Iniciando...
          </>
        ) : (
          'Iniciar conversación'
        )}
      </button>
    </div>
  );
}