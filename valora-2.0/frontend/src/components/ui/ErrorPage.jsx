"use client";

import Image from "next/image";
import Link from "next/link";

const errors = {
  404: {
    code: "404",
    title: "Página no encontrada",
    description: "La página que intentas acceder no existe.",
  },
  500: {
    code: "500",
    title: "Algo salió mal",
    description: "Ocurrió un error inesperado. Inténtelo nuevamente.",
  },
  401: {
    code: "401",
    title: "Acceso no autorizado",
    description: "Debe iniciar sesión para continuar.",
  },
  403: {
    code: "403",
    title: "Acceso denegado",
    description: "No tiene permisos para acceder a esta sección.",
  },
};

export default function ErrorPage({
  type = 500,
  onRetry,
  buttonText = "Volver al inicio",
  buttonHref = "/",
}) {
  const current = errors[type] || errors[500];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">

      {/* Logo de fondo */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={550}
        height={550}
        priority
        className="absolute opacity-5 select-none"
      />

      <section className="z-10 flex w-full max-w-md flex-col items-center text-center">

        {/* Icono */}
        <Image
          src="/error.png"
          alt="Error"
          width={170}
          height={170}
          priority
          className="mb-8"
        />

        {/* Código */}
        <h1 className="text-6xl font-bold text-[#013364]">
          {current.code}
        </h1>

        {/* Título */}
        <h2 className="mt-4 text-3xl font-semibold text-[#013364]">
          {current.title}
        </h2>

        {/* Descripción */}
        <p className="mt-3 text-lg text-gray-500">
          {current.description}
        </p>

        <div className="mt-10 flex gap-4">

          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-full bg-[#013364] px-8 py-4 text-white transition hover:bg-[#022c55]"
            >
              Reintentar
            </button>
          )}

          <Link
            href={buttonHref}
            className="rounded-full bg-[#FF4B4B] px-8 py-4 font-semibold text-white transition hover:bg-red-600"
          >
            {buttonText}
          </Link>

        </div>

      </section>

    </main>
  );
}