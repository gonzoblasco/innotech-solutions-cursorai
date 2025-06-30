'use client';
import React, { useState, useMemo } from 'react';
import AgentCategories from '../../../components/agents/AgentCategories';
import AgentCard from '../../../components/agents/AgentCard';
import { Input } from '../../../components/ui/input';
import { MOCK_AGENTS } from './mock-agents';

const PAGE_SIZE = 8;

export default function AgentsPage() {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Agrupar agentes por categoría
  const agentsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    MOCK_AGENTS.forEach(a => {
      map[a.category] = (map[a.category] || 0) + 1;
    });
    return map;
  }, []);

  // Filtrar agentes
  const filteredAgents = useMemo(() => {
    let agents = MOCK_AGENTS;
    if (category) agents = agents.filter(a => a.category === category);
    if (search) agents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));
    return agents;
  }, [category, search]);

  // Paginación
  const totalPages = Math.ceil(filteredAgents.length / PAGE_SIZE);
  const paginatedAgents = filteredAgents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Skeletons
  const skeletons = Array(PAGE_SIZE).fill(null);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-2">Explorar agentes</h1>
      {/* Categorías */}
      <AgentCategories agentsByCategory={agentsByCategory} onSelect={cat => { setCategory(cat); setPage(1); }} />
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Input
          placeholder="Buscar agente por nombre o especialidad..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1"
        />
        {/* Aquí puedes agregar más filtros (plan, estado, etc) */}
      </div>
      {/* Grid de agentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {loading
          ? skeletons.map((_, i) => <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)
          : paginatedAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} onPreview={() => {}} />
            ))}
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 