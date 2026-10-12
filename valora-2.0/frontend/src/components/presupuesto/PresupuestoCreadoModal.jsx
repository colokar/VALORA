"use client";

import {
  CheckIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { X } from "lucide-react";

export const PresupuestoCreadoModal = ({
  open,
  tipo = "presupuesto",
  onClose,
  onPrimary,
  onSecondary,
}) => {
  if (!open) return null;

  const config = {
    presupuesto: {
      titulo: "Presupuesto creado",
      subtitulo: "satisfactoriamente",
      primaryText: "Descargar",
      secondaryText: "Enviar",
      primaryIcon: <ArrowDownTrayIcon className="w-5 h-5" />,
      secondaryIcon: <PaperAirplaneIcon className="w-5 h-5" />,
    },
    borrador: {
      titulo: "Presupuesto guardado",
      subtitulo: "como borrador",
      primaryText: "Editar",
      secondaryText: "Confirmar",
      primaryIcon: <PencilSquareIcon className="w-5 h-5" />,
      secondaryIcon: <DocumentCheckIcon  className="w-5 h-5" />,
    },
  };

  const data = config[tipo];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            bg-transparent
            transition-all
            duration-200
            hover:bg-[#123B5D]
            group
          "
        >
          <X
            size={20}
            className="text-gray-500 transition-colors duration-200 group-hover:text-white"
          />
        </button>

        <div className="flex flex-col items-center px-6 pt-8 pb-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#123B5D]">
            <CheckIcon className="h-8 w-8 text-[#123B5D] stroke-[2.5]" />
          </div>

          <h2 className="mt-4 text-center text-xl font-semibold leading-tight text-[#123B5D]">
            {data.titulo}
            <br />
            {data.subtitulo}
          </h2>
        </div>

        <div className="grid grid-cols-2 border-t border-[#D9D9D9]">
          <button
            type="button"
            onClick={onPrimary}
            className="flex items-center justify-center gap-2 border-r border-[#D9D9D9] py-4 text-base font-medium text-[#123B5D] transition hover:bg-[#F8FAF9]"
          >
            {data.primaryText}
            {data.primaryIcon}
          </button>

          <button
            type="button"
            onClick={onSecondary}
            className="flex items-center justify-center gap-2 py-4 text-base font-medium text-[#E34B4B] transition hover:bg-[#FFF5F5]"
          >
            {data.secondaryText}
            {data.secondaryIcon}
          </button>
        </div>
      </div>
    </div>
  );
};