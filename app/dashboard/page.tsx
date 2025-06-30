'use client';
import React from 'react';
import { useAuth } from '../../lib/auth';
import StatsCard from '../../components/dashboard/StatsCard';
import QuickActions from '../../components/dashboard/QuickActions';
import { MessageCircle, Bot, Clock, Users } from 'lucide-react';

export default function DashboardHome() {
  const { profile, loading } = useAuth();
  // Simulación de datos
  const stats = [
    { icon: MessageCircle, title: 'Conversaciones este mes', value: profile?.conversationsThisMonth ?? 12, color: 'primary' },
    { icon: Users, title: 'Agentes usados', value: profile?.agentsUsed ?? 3, color: 'info' },
    { icon: Clock, title: 'Tiempo ahorrado', value: profile?.timeSaved ?? '2h 30m', color: 'success' },
    { icon: Bot, title: 'Mensajes restantes', value: `${profile?.usageLimit - (profile?.usage ?? 0) || 55}`, color: 'warning' },
  ];
  const lastConversations = profile?.lastConversations ?? [
    { id: 1, title: 'Soporte técnico', updated_at: '2024-06-01' },
    { id: 2, title: 'Ideas de negocio', updated_at: '2024-05-30' },
    { id: 3, title: 'Traducción urgente', updated_at: '2024-05-28' },
  ];
  const recommendedAgents = profile?.recommendedAgents ?? [
    { id: 1, name: 'Asistente Legal', description: 'Resuelve dudas legales al instante.' },
    { id: 2, name: 'Copywriter AI', description: 'Genera textos creativos y publicitarios.' },
  ];
  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">¡Hola {profile?.full_name?.split(' ')[0] || 'usuario'}!</h1>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} color={stat.color} loading={loading} />
        ))}
      </div>
      {/* Quick actions */}
      <QuickActions />
      {/* Continuar conversaciones */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Continuar conversaciones</h2>
        <div className="flex flex-col gap-2">
          {lastConversations.slice(0, 3).map((conv) => (
            <a key={conv.id} href={`/dashboard/conversations/${conv.id}`} className="p-3 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-primary/10 dark:hover:bg-primary/20 transition flex items-center gap-3 animate-fade-in">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">{conv.title}</span>
              <span className="ml-auto text-xs text-gray-400">{conv.updated_at}</span>
            </a>
          ))}
        </div>
      </section>
      {/* Agentes recomendados */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Agentes recomendados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedAgents.map((agent) => (
            <div key={agent.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition animate-fade-in">
              <div className="font-bold text-primary mb-1">{agent.name}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">{agent.description}</div>
              <a href="/dashboard/agents" className="inline-block mt-2 text-sm text-primary hover:underline">Ver agente</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 