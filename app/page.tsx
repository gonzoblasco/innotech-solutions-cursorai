"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleAccess = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5f9] to-[#f0fdfa] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="flex flex-col items-center gap-8 max-w-lg w-full">
        <Image
          className="drop-shadow-lg"
          src="/globe.svg"
          alt="Logo InnoTech Solutions"
          width={80}
          height={80}
          priority
        />
        <h1 className="text-3xl font-bold text-center text-primary">Bienvenido a InnoTech Solutions</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Plataforma de innovación y tecnología para potenciar tu negocio. Accede a tu panel para comenzar a explorar nuestras soluciones.
        </p>
        <Button
          className="w-full max-w-xs text-lg py-6"
          onClick={handleAccess}
          loading={loading}
        >
          Acceder
        </Button>
      </div>
    </div>
  );
}
