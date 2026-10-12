"use client";
import Image from "next/image";
import Link from "next/link";

export const DateAndImg = ({ nombre, apellido }) => {
  return (
    <div className="w-full h-[64px] bg-white border border-[#DFEAF9] shadow-sm rounded-full px-5 flex items-center justify-between mb-4 p-2 transition-colors duration-200 hover:bg-blue-500/15">
      
      {/* Contenedor unificado: Logo + Nombre */}
      <Link
        href="/perfil"
        className="flex items-center gap-3.5"
      >
        
        {/* Imagen del Logo */}
        <div className="w-11 h-11 relative flex-shrink-0 overflow-hidden rounded-full border border-gray-100 flex items-center justify-center bg-white">
          <Image
            src={"/logo.png"}
            alt="Logo InnovaLab"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>

        {/* Nombre y Apellido */}
        <div className="flex items-center">
          <span className="text-[#0B376D] text-sm font-semibold block leading-none">
            {nombre || "-"} {apellido || "-"}
          </span>
        </div>
      </Link>

      <div></div>
    </div>
  );
};