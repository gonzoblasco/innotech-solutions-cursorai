'use client';
import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { ArrowLeft, RefreshCw, MoreVertical } from 'lucide-react';

export default function ChatWindow({ 
  agent, 
  conversationId,
  conversation 
}: { 
  agent: any;
  conversationId?: string;
  conversation?: any;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar mensajes existentes cuando se monta el componente
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setLoadingMessages(false);
        return;
      }

      try {
        // Aquí podrías cargar mensajes existentes de Supabase
        // Por ahora dejamos vacío para nuevas conversaciones
        setMessages([]);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // Enviar mensaje real a la API
  const handleSend = async () => {
    if (!input.trim() || loading || !conversationId) return;
    
    setLoading(true);
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
      status: 'delivered' as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationId: conversationId,
          agentType: agent.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la respuesta');
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date(),
        status: 'delivered' as const
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Lo siento, hubo un error procesando tu mensaje. Por favor verifica tu conexión e intenta de nuevo.',
        timestamp: new Date(),
        status: 'error' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  // Resetear conversación
  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres resetear la conversación?')) {
      setMessages([]);
    }
  };

  if (loadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Cargando mensajes...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Volver">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={agent.avatar || '/default-agent.png'} alt={agent.name} className="w-9 h-9 rounded-full" />
        <div className="flex-1">
          <div className="font-bold text-primary">{agent.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className={agent.online ? 'text-green-500' : 'text-gray-400'}>●</span> 
            {agent.online ? 'Online' : 'Offline'}
          </div>
        </div>
        <button 
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" 
          onClick={handleReset} 
          title="Resetear conversación"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Opciones">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      {/* Mensajes + input */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-gray-100 dark:to-gray-800">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">¡Hola! Soy {agent.name}</div>
                <div className="text-sm">¿En qué puedo ayudarte hoy?</div>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} agentAvatar={agent.avatar} />
            ))
          )}
          
          {typing && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
              <img src={agent.avatar || '/default-agent.png'} alt="" className="w-6 h-6 rounded-full" />
              <span>{agent.name} está escribiendo...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-20 flex items-end">
          <MessageInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            loading={loading}
            placeholder={`Escribe un mensaje para ${agent.name}...`}
            typing={typing}
          />
        </div>
      </div>
    </div>
  );
}