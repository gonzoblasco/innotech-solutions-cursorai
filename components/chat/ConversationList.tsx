'use client';
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    agent: { name: 'Consultor de Negocios', avatar: '/default-agent.png' },
    lastMessage: '¿Cómo puedo mejorar mi estrategia de marketing?',
    timestamp: new Date(),
    unread: true
  },
  {
    id: '2',
    agent: { name: 'Asesor Financiero', avatar: '/default-agent.png' },
    lastMessage: 'Te recomiendo diversificar tus inversiones.',
    timestamp: new Date(),
    unread: false
  }
  // ...más conversaciones
];

export default function ConversationList({ onSelect, onNew }:{ onSelect: (id: string) => void, onNew: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CONVERSATIONS.filter(c => c.agent.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()));
  return (
    <aside className="w-80 max-w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
        <button className="p-2 rounded bg-primary text-white hover:bg-primary/90 transition" onClick={onNew} title="Nueva conversación"><Plus className="w-5 h-5" /></button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-lg pl-8 pr-2 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && <div className="p-4 text-gray-400 text-sm">Sin conversaciones</div>}
        {filtered.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 transition text-left ${conv.unread ? 'font-bold bg-primary/5' : ''}`}
          >
            <img src={conv.agent.avatar} alt={conv.agent.name} className="w-9 h-9 rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-primary">{conv.agent.name}</div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">{conv.lastMessage}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-400">{conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {conv.unread && <span className="inline-block w-2 h-2 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
} 