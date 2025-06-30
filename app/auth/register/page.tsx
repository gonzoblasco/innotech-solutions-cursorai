"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, User, Globe, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";

const COUNTRIES = [
  { value: "México", label: "México" },
  { value: "Colombia", label: "Colombia" },
  { value: "Argentina", label: "Argentina" },
  { value: "Chile", label: "Chile" },
  { value: "Perú", label: "Perú" },
];

interface RegisterForm {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  terms: boolean;
}

export default function RegisterPage() {
  const { signUp, signInWithGoogle, loading, error, user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const onSubmit = async (data: RegisterForm) => {
    await signUp(data.email, data.password, {
      full_name: data.full_name,
      subscription_tier: "free",
      api_usage_current: 0,
      api_quota: 1000,
      country: data.country,
    });
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
            label="Nombre completo"
            variant="text"
            leadingIcon={<User />}
            state={errors.full_name ? "error" : "default"}
            errorMessage={errors.full_name?.message}
            {...register("full_name", { required: "El nombre es obligatorio" })}
            autoComplete="name"
            disabled={loading}
          />
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
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
              validate: {
                hasUpper: v => /[A-Z]/.test(v) || "Debe tener una mayúscula",
                hasNumber: v => /[0-9]/.test(v) || "Debe tener un número",
              },
            })}
            autoComplete="new-password"
            disabled={loading}
          />
          <Input
            label="Confirmar contraseña"
            variant="password"
            leadingIcon={<Lock />}
            state={errors.confirmPassword ? "error" : "default"}
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: v => v === watch("password") || "Las contraseñas no coinciden",
            })}
            autoComplete="new-password"
            disabled={loading}
          />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">País</label>
            <select
              className={`w-full rounded-md border bg-white dark:bg-gray-900 py-2 px-3 text-base shadow-sm focus:outline-none focus:ring-2 transition ${errors.country ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-primary focus:ring-primary'}`}
              {...register("country", { required: "Selecciona un país" })}
              disabled={loading}
            >
              <option value="">Selecciona tu país</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-xs text-error">{errors.country.message}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("terms", { required: "Debes aceptar los términos" })} className="accent-primary" disabled={loading} />
            Acepto los <a href="#" className="text-primary underline">términos y condiciones</a>
          </label>
          {errors.terms && <p className="text-xs text-error">{errors.terms.message}</p>}
          {error && <div className="text-error text-sm text-center">{error}</div>}
          <Button type="submit" loading={loading} className="w-full" leftIcon={<UserPlus />}>
            Crear cuenta
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={signInWithGoogle}
            loading={loading}
            leftIcon={<ShieldCheck />}
          >
            Registrarse con Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 