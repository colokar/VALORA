"use client";

import { X } from "lucide-react";

export const ObservacionesModal = ({ open, onClose, register }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-[#123B5D]">
            Observaciones
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="
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
        </div>

        {/* Textarea */}
        <textarea
          {...register("observaciones")}
          placeholder="Sin observaciones."
          rows={5}
          className="
            w-full
            rounded-2xl
            border
            border-gray-300
            p-4
            resize-none
            text-sm
            text-[#123B5D]
            placeholder:text-gray-400
            outline-none
            focus:border-[#528A72]
            focus:ring-2
            focus:ring-[#528A72]/20
          "
        />

        {/* Botón guardar */}
        <button
          type="button"
          onClick={onClose}
          className="
            mt-4
            w-full
            h-12
            rounded-xl
            bg-[#528A72]
            text-white
            font-semibold
            transition
            hover:bg-[#467761]
          "
        >
          Guardar
        </button>
      </div>
    </div>
  );
};