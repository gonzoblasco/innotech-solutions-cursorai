'use client';
import React from 'react';
import { Plus, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();
  return (
    <div className="flex gap-4 mt-4 animate-fade-in">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
        onClick={() => router.push('/dashboard/new')}
      >
        <Plus className="w-5 h-5" />
        Nueva conversación
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => router.push('/dashboard/agents')}
      >
        <Compass className="w-5 h-5" />
        Explorar agentes
      </button>
    </div>
  );
} 