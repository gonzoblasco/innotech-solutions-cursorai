"use client";
import React from "react";
import { useAuth } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <div className="animate-pulse w-16 h-16 rounded-full bg-primary/20 mb-4" />
        <div className="h-4 w-32 bg-primary/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center">
        <div className="text-error font-semibold mb-2">No tienes acceso</div>
        <div className="text-gray-500">Por favor inicia sesión para continuar.</div>
      </div>
    );
  }
  return <>{children}</>;
} 