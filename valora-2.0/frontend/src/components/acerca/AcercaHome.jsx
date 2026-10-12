"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FadeIn } from "@/components/ui/FadeIn";

export const AcercaPage = () => {
  const router = useRouter();

  return (
    <FadeIn>
      <div className="bg-white min-h-screen p-5 pb-28">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />
          </button>
          <h1 className="text-2xl font-semibold text-black">Acerca de</h1>
          <div className="w-6" />
        </div>

        <div className="flex flex-col items-center text-center mt-20">
          <div className="flex items-center justify-center gap-1">
            <img
              src="/logo.png"
              alt="Valora"
              className="w-16 h-16 object-contain"
            />
            <span className="text-3xl font-bold text-[#123B5D] -ml-1">
              VALORA
            </span>
          </div>

          <h2 className="text-2xl font-semibold mt-15">Valora S.A.</h2>

          <p className="mt-3">Versión beta 1.0.0</p>

          <div className="mt-8 text-center text-[#123B5D]">
            <p>Desarrollado por</p>
            <p>Innova Lab Equipo 11</p>
          </div>

          <div className="mt-8 text-center text-[#123B5D]">
            <p>2026 Valora S.A.</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};
