"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PresupuestoForm } from "./PresupuestoForm";
import Loading from "../ui/loading/Loading"

export const PresupuestoPage = () => {
  const router = useRouter();

  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    // 2. Aquí puedes hacer alguna llamada inicial si la necesitas, 
    // o simplemente apagar el loading una vez que el componente se montó.
    const timer = setTimeout(() => {
      setLoadingInitial(false);
    }, 800); // Pequeño respiro visual para mostrar el loading

    return () => clearTimeout(timer);
  }, []);

  if (loadingInitial) {
    return <Loading text="Preparando nuevo presupuesto..." />;
  }

  return (
    <div >
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-6 h-6 text-[#123B5D]" />
        </button>

        <h1 className="text-2xl font-semibold text-black">
          Nuevo presupuesto
        </h1>

        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto">
        <PresupuestoForm />
      </div>
    </div>
  );
};