"use client";
import React from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function ProtectedRoute<P extends { user: any; profile: any }>(Component: React.ComponentType<P>) {
  return function Wrapper(props: Omit<P, "user" | "profile">) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [loading, user, router]);

    if (loading) {
      return <div className="w-full flex justify-center items-center py-12 text-primary">Cargando...</div>;
    }
    if (!user) return null;
    return <Component {...(props as P)} user={user} profile={profile} />;
  };
} 