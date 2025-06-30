import React, { useState } from 'react';
import { Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';

export default function Header() {
  const { user, profile, loading } = useAuth();
  const [dark, setDark] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  // Simulación de datos de plan y uso
  const plan = profile?.plan || 'Free';
  const usage = profile?.usage || 45;
  const usageLimit = profile?.usageLimit || 100;

  // Toggle dark mode (simple, para demo)
  const handleToggleDark = () => {
    setDark((d) => {
      if (!d) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return !d;
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-8 h-16 transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-xl text-primary mr-6">
        <span className="hidden md:inline">InnoTech Solutions</span>
        <span className="md:hidden">InnoTech</span>
      </div>
      {/* Search bar */}
      <form className="flex-1 max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full rounded-lg pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </form>
      {/* Plan & usage */}
      <div className="hidden md:flex flex-col items-end mx-6">
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded',
          plan === 'Free' && 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200',
          plan === 'Premium' && 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
          plan === 'Enterprise' && 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200')}>{plan}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{usage}/{usageLimit} mensajes</span>
      </div>
      {/* Dark mode toggle */}
      <button
        className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={handleToggleDark}
        aria-label="Cambiar modo oscuro"
        type="button"
      >
        {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-200" />}
      </button>
      {/* Avatar y dropdown */}
      <div className="relative ml-4">
        <button
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setDropdown((d) => !d)}
          aria-label="Menú de usuario"
          type="button"
        >
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || user?.email || 'U'}&background=0D8ABC&color=fff`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        {/* Dropdown menu */}
        {dropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 animate-fade-in z-50">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-semibold">{profile?.full_name || user?.email}</div>
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Plan: {plan}</div>
            <hr className="my-1 border-gray-100 dark:border-gray-800" />
            <a href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-primary/10 dark:hover:bg-primary/20 transition">Configuración</a>
            <a href="/dashboard/billing" className="block px-4 py-2 text-sm hover:bg-primary/10 dark:hover:bg-primary/20 transition">Facturación</a>
            <a href="/auth/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Cerrar sesión</a>
          </div>
        )}
      </div>
    </header>
  );
} 