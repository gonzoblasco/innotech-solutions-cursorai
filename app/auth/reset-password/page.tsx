"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { Mail, Send } from "lucide-react";

interface ResetForm {
  email: string;
}

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ mode: "onChange" });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
    if (error) {
      setError("No se pudo enviar el correo. Intenta de nuevo.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <Card variant="elevated">
      <CardContent>
        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-success text-lg font-semibold">¡Correo enviado!</div>
            <div className="text-gray-600 dark:text-gray-300">Revisa tu bandeja de entrada para restablecer tu contraseña.</div>
            <Link href="/auth/login" className="text-primary hover:underline text-sm">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              variant="email"
              leadingIcon={<Mail />}
              state={errors.email ? "error" : "default"}
              errorMessage={errors.email?.message}
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Correo inválido",
                },
              })}
              autoComplete="email"
              disabled={loading}
            />
            {error && <div className="text-error text-sm text-center">{error}</div>}
            <Button type="submit" loading={loading} className="w-full" leftIcon={<Send />}>
              Enviar enlace
            </Button>
            <div className="text-center mt-2">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 