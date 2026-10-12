"use client";

import { ChevronDown, FileText } from "lucide-react";

export const ObservacionesCard = ({ observaciones, onOpen }) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        w-full
        bg-white
        border
        border-[#E6ECE9]
        rounded-2xl
        pl-6
        pr-4
        py-4
        shadow-sm
        flex
        items-center
        justify-between
        transition
        hover:bg-[#F8FAF9]
      "
    >
      <div className="flex flex-1 items-center gap-5">
        <div className="w-10 h-10 rounded-xl bg-[#F2F5F7] flex items-center justify-center shrink-0">
          <FileText size={20} strokeWidth={2} className="text-[#123B5D]" />
        </div>

        <div className="flex-1 text-left">
          <p className="text-base font-semibold text-[#123B5D]">
            Observaciones
          </p>

          <p className="mt-1 text-sm text-[#667085] truncate">
            {observaciones?.trim() ? observaciones : "Sin observaciones."}
          </p>
        </div>
      </div>

      <ChevronDown size={20} strokeWidth={2} className="text-[#123B5D] shrink-0" />
    </button>
  );
};