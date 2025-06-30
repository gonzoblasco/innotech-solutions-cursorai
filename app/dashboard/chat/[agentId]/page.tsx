'use client';
import React, { useState, useEffect } from 'react';
import ChatWindow from '../../../../components/chat/ChatWindow';
import ConversationList from '../../../../components/chat/ConversationList';
import { useSearchParams } from 'next/navigation';

const MOCK_AGENTS = [
  {
    id: 'business-consultant',
    name: 'Consultor de Negocios',
    avatar: '/default-agent.png',
    online: true
  },
  {
    id: 'financial-advisor',
    name: 'Asesor Financiero',
    avatar: '/default-agent.png',
    online: true
  },
  {
    id: 'health-coach',
    name: 'Coach de Salud',
    avatar: '/default-agent.png',
    online: true
  },
  {
    id: 'education-tutor',
    name: 'Tutor Educativo',
    avatar: '/default-agent.png',
    online: true
  },
  {
    id: 'personal-assistant',
    name: 'Asistente Personal',
    avatar: '/default-agent.png',
    online: true
  }
];

export default function ChatPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = React.use(params);
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // El agentId en la URL es en realidad el conversationId
  const conversationId = agentId;
  const actualAgentId = searchParams.get('agent');
  
  // Buscar el agente por ID
  const agent = MOCK_AGENTS.find(a => a.id === actualAgentId) || MOCK_AGENTS[0];

  useEffect(() => {
    // Cargar datos de la conversación
    const loadConversation = async () => {
      try {
        // Aquí podrías cargar la conversación real de Supabase si quieres
        // Por ahora usamos el conversationId directamente
        setConversation({
          id: conversationId,
          agentId: actualAgentId,
          title: `Conversación con ${agent.name}`
        });
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, actualAgentId, agent.name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando conversación...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-[#e0e7ff] via-[#f1f5f9] to-[#f0fdfa] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar desktop */}
      <div className="hidden md:block h-full">
        <ConversationList onSelect={() => {}} onNew={() => {}} />
      </div>
      
      {/* Sidebar mobile (colapsable) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ConversationList onSelect={() => { setSidebarOpen(false); }} onNew={() => {}} />
      </div>
      
      {/* Chat principal */}
      <div className="flex-1 h-full">
        <ChatWindow 
          agent={agent} 
          conversationId={conversationId}
          conversation={conversation}
        />
      </div>
      
      {/* Botón abrir sidebar mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-60 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md" 
        onClick={() => setSidebarOpen(true)} 
        aria-label="Abrir conversaciones"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
        </svg>
      </button>
    </div>
  );
}