'use client';
import React from 'react';
import { Briefcase, PiggyBank, HeartPulse, GraduationCap, User } from 'lucide-react';

const CATEGORIES = [
  {
    key: 'business',
    name: 'Negocios',
    icon: Briefcase,
    description: 'Estrategia, crecimiento y consultoría empresarial.'
  },
  {
    key: 'finances',
    name: 'Finanzas',
    icon: PiggyBank,
    description: 'Gestión financiera, inversiones y ahorro.'
  },
  {
    key: 'health',
    name: 'Salud',
    icon: HeartPulse,
    description: 'Bienestar, medicina y vida saludable.'
  },
  {
    key: 'education',
    name: 'Educación',
    icon: GraduationCap,
    description: 'Aprendizaje, docencia y recursos educativos.'
  },
  {
    key: 'personal',
    name: 'Personal',
    icon: User,
    description: 'Asistentes personales y productividad.'
  },
];

export default function AgentCategories({ agentsByCategory, onSelect }:{ agentsByCategory: Record<string, number>, onSelect: (cat: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {CATEGORIES.map(cat => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className="group flex flex-col items-center p-4 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-xl border border-transparent hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary animate-fade-in"
          >
            <div className="mb-2 rounded-full bg-primary/10 dark:bg-primary/20 p-3 group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <div className="font-bold text-primary mb-1">{cat.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">{cat.description}</div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-1">{agentsByCategory[cat.key] || 0} agentes</div>
          </button>
        );
      })}
    </div>
  );
} 