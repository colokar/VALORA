
"use client";

import Spinner from "./Spinner";
/**
 * Loading — dos modos:
 *
 * variant="page" (por defecto)
 *   → pantalla completa con fondo, para Suspense / rutas protegidas
 *   → Ejemplo: <Loading />
 *
 * variant="section"
 *   → ocupa solo el área de contenido, sin fondo propio
 *   → Para reemplazar los <p>Cargando...</p> dentro del dashboard
 *   → Ejemplo: <Loading variant="section" text="Cargando pagos..." />
 *
 * Props:
 *   text    — mensaje (default: "Cargando...")
 *   variant — "page" | "section"
 */

export default function Loading({
  text = "Cargando...",
  variant = "fullscreen",
}) {
  const isOverlay = variant === "overlay";

  return (
    <div
      className={`
        ${
          isOverlay
            ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm"
            : "min-h-screen bg-white"
        }
        flex items-center justify-center
      `}
    >
      <div className="flex flex-col items-center gap-6">

        <Spinner size="lg" />

        <p className="text-lg font-semibold text-[#013364] animate-pulse">
          {text}
        </p>

      </div>
    </div>
  );
}