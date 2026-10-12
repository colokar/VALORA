"use client";

import React from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ActividadSemanal = ({ actividadSemanal = [], periodo, cambiarPeriodo }) => {
  const estructuraSemana = [
    { keyEn: "Mon", keyEs: "Lun" },
    { keyEn: "Tue", keyEs: "Mar" },
    { keyEn: "Wed", keyEs: "Mié" },
    { keyEn: "Thu", keyEs: "Jue" },
    { keyEn: "Fri", keyEs: "Vie" },
    { keyEn: "Sat", keyEs: "Sáb" },
    { keyEn: "Sun", keyEs: "Dom" },
  ];

  const obtenerValores = (dia, label = dia) => {
    const registro = actividadSemanal.find((item) => item.dia === dia);
    return {
      dia: label,
      aprobados: Number(registro?.aprobados || 0),
      pendientes: Number(registro?.pendientes || 0),
      rechazados: Number(registro?.rechazados || 0),
    };
  };

  const datosCompletos = periodo === "diario"
    ? Array.from({ length: 24 }, (_, hora) => {
        const etiqueta = `${String(hora).padStart(2, "0")}:00`;
        return obtenerValores(etiqueta);
      })
    : periodo === "mensual"
      ? actividadSemanal.map((item) => {
          const [anio, mes, dia] = item.dia.split("-").map(Number);
          const etiqueta = new Date(anio, mes - 1, dia).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
          });
          return {
            dia: etiqueta,
            aprobados: Number(item.aprobados || 0),
            pendientes: Number(item.pendientes || 0),
            rechazados: Number(item.rechazados || 0),
          };
        })
      : estructuraSemana.map((diaObj) => {
          const registro = actividadSemanal.find(
            (item) =>
              item.dia?.trim().toLowerCase() === diaObj.keyEn.toLowerCase() ||
              item.dia?.trim().toLowerCase() === diaObj.keyEs.toLowerCase()
          );
          return {
            dia: diaObj.keyEs,
            aprobados: Number(registro?.aprobados || 0),
            pendientes: Number(registro?.pendientes || 0),
            rechazados: Number(registro?.rechazados || 0),
          };
        });

  const tituloActividad = {
    diario: "Actividad de hoy",
    semanal: "Actividad semanal",
    mensual: "Actividad del último mes",
  }[periodo] || "Actividad semanal";

  return (
    <div className="w-full bg-white shadow-[0px_4px_16px_rgba(0,31,77,0.06)] rounded-[20px] p-5 flex flex-col justify-between mb-4">
      
      {/* Cabecera: Título y Ver más */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#0B376D] text-lg font-bold">{tituloActividad}</span>
        <Link
          href="/dashboard/modo-dashboard" 
          className="text-[#2E7D5B] text-[13px] font-bold cursor-pointer hover:underline"
        >
          Ver más
        </Link>
      </div>

      {/* Filtros superiores interactivos (Diario, Semanal, Mensual) */}
      <div className="w-full bg-gray-50 p-1.5 rounded-[12px] flex items-center justify-between mb-5 border border-gray-100">
        <button 
          onClick={() => cambiarPeriodo('diario')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'diario' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Diario
        </button>
        <button 
          onClick={() => cambiarPeriodo('semanal')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'semanal' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Semanal
        </button>
        <button 
          onClick={() => cambiarPeriodo('mensual')}
          className={`flex-1 text-xs py-2 rounded-[9px] transition-all font-medium ${periodo === 'mensual' ? 'bg-[#013364] text-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
        >
          Mensual
        </button>
      </div>

      {/* El eje horizontal se adapta al período seleccionado. */}
      <div className="h-[140px] w-full mb-4 border-b border-gray-100 pb-2">
        {datosCompletos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No hay actividad en este período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosCompletos} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="dia"
                stroke="#9ca3af"
                fontSize={periodo === "mensual" ? 9 : 11}
                tickLine={false}
                interval={periodo === "diario" ? 2 : periodo === "mensual" ? 3 : 0}
              />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="aprobados" name="Aprobados" fill="#013364" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendientes" name="Pendientes" fill="#4D7093" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rechazados" name="Rechazados" fill="#B3C2D0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leyenda inferior */}
      <div className="flex justify-center items-center gap-6 text-xs text-black/60 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#013364] rounded-[3px]"></div>
          <span>Aprobados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4D7093] rounded-[3px]"></div>
          <span>Pendientes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#B3C2D0] rounded-[3px]"></div>
          <span>Rechazados</span>
        </div>
      </div>

    </div>
  );
};