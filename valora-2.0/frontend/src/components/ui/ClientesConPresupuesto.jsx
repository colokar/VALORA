"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import Spinner from "@/components/ui/loading/Spinner";
import Loading from "@/components/ui/loading/Loading";

function calcularDiasRestantes(fechaVencimientoString) {
  if (!fechaVencimientoString) return "";
  const fechaVenc = new Date(fechaVencimientoString);
  const hoy = new Date();

  fechaVenc.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diferenciaTiempo = fechaVenc - hoy;
  const diferenciaDias = Math.round(diferenciaTiempo / (1000 * 60 * 60 * 24));

  if (diferenciaDias < 0) return "Vencido";
  if (diferenciaDias === 0) return "Vence hoy";
  if (diferenciaDias === 1) return "Vence en 1 día";
  return `Vence en ${diferenciaDias} días`;
}

function calcularDiasDeCreado(fechaString) {
  if (!fechaString) return "";
  const fechaItem = new Date(fechaString);
  const hoy = new Date();

  fechaItem.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diferenciaTiempo = hoy - fechaItem;
  const diferenciaDias = Math.round(diferenciaTiempo / (1000 * 60 * 60 * 24));

  if (diferenciaDias === 0) return "Hoy";
  if (diferenciaDias === 1) return "Ayer";
  if (diferenciaDias > 1) return `Hace ${diferenciaDias} días`;
  return "";
}
/* USAR COMO REUTILIZABLE  */
export default function ClienteConPresupuesto({
  presupuestos,
  loading,
  totalRegistros,
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  esVistaCompleta = false,
  onVerMasClick,
}) {

  return (
    <div className="flex flex-col gap-2 flex-1 my-1">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#0B376D] text-lg font-bold">
          {esVistaCompleta ? "Todos los Presupuestos" : "Recientes"}
        </span>

        {/* Si no es vista completa, mostramos el botón que dispara la función del padre */}
        {!esVistaCompleta && (
          <Link
            href="/historial/lista"
            className="text-[#2E7D5B] text-[13px] font-bold cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            Ver más
          </Link>
        )}
      </div>
      {/* Lista de presupuestos */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 flex-1">
            <Spinner size="sm" />
            <p className="text-xs text-gray-500 font-medium">
              Cargando presupuestos...
            </p>
          </div>
        ) : presupuestos && presupuestos.length > 0 ? (
          presupuestos.map((item) => (
            <Link
              key={item.id}
              href={`/historial/${item.id}`}
              className="flex justify-between items-center bg-white border border-gray-100 shadow-sm p-3 rounded-[16px] transition-colors duration-200 hover:bg-blue-500/15"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0B376D] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-inner">
                  {item?.cliente_nombre
                    ? `${item.cliente_nombre[0]}${item?.cliente_apellido ? item.cliente_apellido[0] : ""}`.toUpperCase()
                    : "CL"}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[#0B376D] text-base truncate max-w-[200px]">
                    {item?.cliente_nombre ?? "Cliente"}{" "}
                    {item?.cliente_apellido ?? ""}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#0B376D] font-medium">
                      {`#${item.numero}` || `#P-${item.id.substring(0, 4)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#0B376D] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0B376D]" />
                      {calcularDiasDeCreado(item.fecha)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      item.estado === "Aceptado" || item.estado === "Aprobado"
                        ? "bg-[#E8F5E9] text-[#4CAF50]"
                        : item.estado === "Rechazado"
                          ? "bg-[#FFEBEE] text-[#C62828]"
                          : "bg-[#FFF8E1] text-[#FFC107]"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {item.estado === "Guardado" ? "Pendiente" : item.estado}
                  </span>

                  <span className="text-gray-400 text-xs font-medium">
                    {calcularDiasRestantes(item.fecha_vencimiento)}
                  </span>

                  <span className="text-[14px] font-bold leading-[22px] text-[#0B376D] tracking-tight">
                    $
                    {parseFloat(item.total || 0).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <svg
                  className="w-5 h-5 text-[#0B376D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-black/40 text-xs py-10">
            No hay presupuestos registrados
          </div>
        )}
      </div>

      {/* Controles de Paginación */}
      {!loading && totalRegistros > 0 && (
        <div className="flex items-center justify-between pt-3 px-2 border-t border-gray-200 mt-2">
          <span className="text-xs text-gray-500">
            Página <strong>{paginaActual}</strong> de{" "}
            <strong>{totalPaginas || 1}</strong> ({totalRegistros} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onCambiarPagina(paginaActual - 1)}
              disabled={paginaActual <= 1}
              className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-xl text-[#0B376D] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => onCambiarPagina(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas}
              className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-xl text-[#0B376D] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
