'use client';
import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { ArrowLeft, RefreshCw, MoreVertical } from 'lucide-react';

const MOCK_MESSAGES = [
  {
    id: '1',
    role: 'user',
    content: '¿Cómo puedo mejorar mi estrategia de marketing?',
    timestamp: new Date(),
    status: 'delivered'
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Excelente pregunta. Para mejorar tu estrategia de marketing...',
    timestamp: new Date(),
    status: 'delivered'
  }
];

export default function ChatWindow({ agent }:{ agent: any }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular respuesta del agente
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'delivered'
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Respuesta simulada del agente...',
        timestamp: new Date(),
        status: 'delivered'
      }]);
      setTyping(false);
    }, 1200);
  };

  // Resetear conversación
  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres resetear la conversación?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Cambiar agente"><ArrowLeft className="w-5 h-5" /></button>
        <img src={agent.avatar || '/default-agent.png'} alt={agent.name} className="w-9 h-9 rounded-full" />
        <div className="flex-1">
          <div className="font-bold text-primary">{agent.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className={agent.online ? 'text-green-500' : 'text-gray-400'}>●</span> {agent.online ? 'Online' : 'Offline'}
          </div>
        </div>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleReset} title="Resetear conversación"><RefreshCw className="w-5 h-5" /></button>
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Opciones"><MoreVertical className="w-5 h-5" /></button>
      </div>
      {/* Mensajes + input */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-gray-100 dark:to-gray-800">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} agentAvatar={agent.avatar} />
          ))}
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