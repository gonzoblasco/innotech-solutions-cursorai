import { useState, useEffect, useCallback } from 'react';
import { apiGetConversations, apiCreateConversation } from '../lib/chat/api';
import { useAuth } from '../lib/auth';

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    if (!user) return;
    try {
      const data = await apiGetConversations(user.id);
      setConversations(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createConversation = useCallback(async (agentType: string, title?: string) => {
    if (!user) return;
    const conv = await apiCreateConversation(agentType, title);
    await loadConversations();
    return conv;
  }, [user, loadConversations]);

  // Real-time updates (mock, deberías usar Supabase real-time)
  useEffect(() => {
    loadConversations();
    // Aquí puedes agregar lógica de suscripción a Supabase
  }, [loadConversations]);

  return {
    conversations,
    loading,
    createConversation,
    loadConversations
  };
} 