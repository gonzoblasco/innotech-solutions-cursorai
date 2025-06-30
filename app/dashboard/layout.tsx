'use client';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!user) return <div className="flex items-center justify-center min-h-screen">Redirigiendo...</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e0e7ff] via-[#f1f5f9] to-[#f0fdfa] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-56 transition-all">
        <Header />
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
} 