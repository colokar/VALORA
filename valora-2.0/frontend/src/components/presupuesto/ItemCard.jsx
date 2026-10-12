"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export const ItemCard = ({ item, onDelete, onCantidadChange }) => {
  const subtotal = Number(item.precio) * Number(item.cantidad);

  const [editandoCantidad, setEditandoCantidad] = useState(false);

  const finalizarEdicion = () => {
    setEditandoCantidad(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECE9] p-5 shadow-sm">
      {/* Nombre */}
      <h3 className="font-semibold text-lg text-[#123B5D] mb-5">
        {item.nombre}
      </h3>

      {/* Datos */}
      <div className="flex items-stretch">
        {/* Cantidad */}
        <div className="flex-1 text-center">
          <p className="text-xs text-[#98A2B3] mb-1 leading-tight">
            Cantidad
          </p>

          {editandoCantidad ? (
            <input
              autoFocus
              type="number"
              min="1"
              value={item.cantidad}
              onBlur={finalizarEdicion}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              onChange={(e) =>
                onCantidadChange(item.id, Number(e.target.value))
              }
              className="
                w-12
                bg-transparent
                border-none
                outline-none
                text-center
                font-semibold
                text-[17px]
                text-[#123B5D]
                leading-tight
              "
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditandoCantidad(true)}
              className="
                font-semibold
                text-[17px]
                text-[#123B5D]
                leading-tight
                cursor-pointer
              "
            >
              {item.cantidad}
            </button>
          )}
        </div>

        {/* Separador vertical */}
        <div className="w-px bg-[#D0D9D5] mx-4" />

        {/* Precio unitario */}
        <div className="flex-[1.4] text-center">
          <p className="text-xs text-[#98A2B3] mb-1 leading-tight">
            Precio unitario
          </p>

          <p className="font-semibold text-[17px] text-[#123B5D] whitespace-nowrap leading-tight">
            ${Number(item.precio).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Separador vertical */}
        <div className="w-px bg-[#D0D9D5] mx-4" />

        {/* Subtotal */}
        <div className="flex-1 text-center">
          <p className="text-xs text-[#98A2B3] mb-1 leading-tight">
            Subtotal
          </p>

          <p className="font-semibold text-[17px] text-[#123B5D] whitespace-nowrap leading-tight">
            ${subtotal.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Línea horizontal */}
      <div className="mt-1 mb-5 border-t border-[#D0D9D5]" />

      {/* Eliminar */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="
            w-[42%]
            -translate-x-1
            h-9
            rounded-2xl
            border
            border-red-300
            text-red-500
            relative
            flex
            items-center
            justify-center
            text-sm
            font-medium
            transition
            hover:bg-red-50
          "
        >
          <Trash2
            size={20}
            strokeWidth={1.5}
            className="absolute left-4"
          />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};