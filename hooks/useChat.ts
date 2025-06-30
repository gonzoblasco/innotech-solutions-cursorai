import { useState, useEffect, useCallback } from 'react';
import { apiSendMessage, apiGetMessages, apiCreateConversation } from '../lib/chat/api';
import { AgentManager } from '../lib/agents/manager';
import { useAuth } from '../lib/auth';

export function useChat(conversationId: string, agentType: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);

  // Cargar historial
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const msgs = await apiGetMessages(conversationId);
      setMessages(msgs);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Enviar mensaje
  const sendMessage = useCallback(async (msg: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiSendMessage(conversationId, msg, agentType);
      await loadHistory(); // Optimista: podrías agregar el mensaje localmente primero
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId, agentType, loadHistory]);

  // Resetear conversación
  const resetConversation = useCallback(() => {
    setMessages([]);
    setConversation(null);
  }, []);

  // Real-time subscription (mock, deberías usar Supabase real-time)
  useEffect(() => {
    loadHistory();
    // Aquí puedes agregar lógica de suscripción a Supabase
  }, [loadHistory]);

  return {
    messages,
    loading,
    error,
    conversation,
    sendMessage,
    resetConversation,
    loadHistory
  };
} 