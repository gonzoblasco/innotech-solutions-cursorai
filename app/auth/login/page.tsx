"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, CheckCircle, Loader2, LogIn, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const { signIn, signInWithGoogle, loading, error, user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onChange" });

  const onSubmit = async (data: LoginForm) => {
    await signIn(data.email, data.password);
  };

  React.useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  return (
    <Card variant="elevated">
      <CardContent>
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
          <Input
            label="Contraseña"
            variant="password"
            leadingIcon={<Lock />}
            state={errors.password ? "error" : "default"}
            errorMessage={errors.password?.message}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("remember")} className="accent-primary" /> Recordarme
            </label>
            <Link href="/auth/reset-password" className="text-primary text-sm hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {error && <div className="text-error text-sm text-center">{error}</div>}
          <Button type="submit" loading={loading} className="w-full" leftIcon={<LogIn />}>
            Iniciar sesión
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={signInWithGoogle}
            loading={loading}
            leftIcon={<ShieldCheck />}
          >
            Iniciar sesión con Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Crear cuenta nueva
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 