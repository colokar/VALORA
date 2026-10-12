"use client";

import React from 'react';

export const TotalActivo = ({ 
  sumaTotal = 0, 
  sumaTotalMesAnterior = 0,
  totalPresupuestos = 0, 
  aceptados = 0, 
  rechazados = 0 
}) => {
  const montoMesAnterior = Number(sumaTotalMesAnterior) || 0;
  const montoEsteMes = Number(sumaTotal) || 0;
  const variacion = montoMesAnterior > 0
    ? Math.round(((montoEsteMes - montoMesAnterior) / montoMesAnterior) * 100)
    : null;

  return (
    <div className="w-full bg-[#013364] bg-gradient-to-t from-black/10 to-black/10 shadow-[0px_4px_16px_rgba(0,31,77,0.10)] rounded-[20px] p-6 text-white flex flex-col justify-between  mb-4">
      {/* Parte superior: Título y Monto */}
      <div>
        <span className="text-white/70 text-sm font-medium block">
          Total presupuestado este mes
        </span>
        <div className="text-white text-3xl font-extrabold mt-1 tracking-tight">
          ${parseFloat(sumaTotal || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Porcentaje vs mes anterior */}
      <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium my-4">
        {variacion !== null ? (
          <>
            <span className={`font-bold text-sm ${variacion >= 0 ? "text-green-400" : "text-rose-300"}`}>
              {variacion >= 0 ? "↑" : "↓"}
            </span>
            <span>{Math.abs(variacion)}% vs el mes anterior</span>
          </>
        ) : (
          <span>{montoEsteMes > 0 ? "Nuevo este mes" : "Sin actividad el mes anterior"}</span>
        )}
      </div>

      {/* Chips de estadísticas (Presupuestos, Aceptados, Rechazados) */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="bg-[#718EBF]/30 rounded-[12px] px-3 py-2.5 flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[#E7EBF4]/80 text-[11px] font-medium">Presupuestos</span>
          <span className="text-white text-base font-bold mt-1">{totalPresupuestos}</span>
        </div>
        <div className="bg-[#718EBF]/30 rounded-[12px] px-3 py-2.5 flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[#E7EBF4]/80 text-[11px] font-medium">Aceptados</span>
          <span className="text-white text-base font-bold mt-1">{aceptados}</span>
        </div>
        <div className="bg-[#718EBF]/30 rounded-[12px] px-3 py-2.5 flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[#E7EBF4]/80 text-[11px] font-medium">Rechazados</span>
          <span className="text-white text-base font-bold mt-1">{rechazados}</span>
        </div>
      </div>
    </div>
  );
};