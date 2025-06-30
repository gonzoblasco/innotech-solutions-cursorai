import React, { useState } from 'react';
import { Home, Bot, MessageCircle, Settings, CreditCard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Inicio', icon: Home, href: '/dashboard' },
  { name: 'Agentes', icon: Bot, href: '/dashboard/agents' },
  { name: 'Conversaciones', icon: MessageCircle, href: '/dashboard/conversations' },
  { name: 'Configuración', icon: Settings, href: '/dashboard/settings' },
  { name: 'Facturación', icon: CreditCard, href: '/dashboard/billing' },
];

export default function Sidebar({ active, onClose }: { active?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((v) => !v);
  return (
    <>
      {/* Mobile menu button */}
      <button className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md" onClick={handleToggle} aria-label="Abrir menú">
        <Menu className="w-6 h-6" />
      </button>
      {/* Overlay mobile */}
      <div className={cn('fixed inset-0 bg-black/40 z-30 transition-opacity', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none', 'md:hidden')} onClick={handleToggle} />
      {/* Sidebar */}
      <aside className={cn(
        'fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:block md:w-56 md:shadow-none md:border-none'
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-lg tracking-tight text-primary">InnoTech</span>
          <button className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleToggle} aria-label="Cerrar menú">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-6 py-2 rounded-lg font-medium transition-colors',
                  'hover:bg-primary/10 dark:hover:bg-primary/20',
                  isActive ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-200'
                )}
                onClick={() => { setOpen(false); onClose?.(); }}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-t py-1 justify-around">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            <item.icon className="w-5 h-5 mb-0.5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </>
  );
} 