"use client";

import { useState, useMemo, useEffect } from "react";
import Spinner from "@/components/ui/loading/Spinner";
import ClienteConPresupuesto from "../../ui/ClientesConPresupuesto";

export default function CalendarioPresupuesto({
  presupuestos,
  loading,
  onSeleccionarFecha,
  totalRegistros,
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) {
  const [fechaActual, setFechaActual] = useState(new Date());

  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Mantenemos un Set acumulativo con TODAS las fechas que han tenido presupuesto
  // para que no se borren los puntos verdes cuando el componente padre filtre por un día específico.
  const [fechasConPresupuestoAcumuladas, setFechasConPresupuestoAcumuladas] =
    useState(new Set());

  useEffect(() => {
    if (presupuestos && Array.isArray(presupuestos)) {
      setFechasConPresupuestoAcumuladas((prevSet) => {
        const nuevoSet = new Set(prevSet);
        presupuestos.forEach((p) => {
          if (!p.fecha) return;
          const fechaLimpia = p.fecha.includes("T")
            ? p.fecha.split("T")[0]
            : p.fecha.substring(0, 10);
          nuevoSet.add(fechaLimpia);
        });
        return nuevoSet;
      });
    }
  }, [presupuestos]);

  const mesAnterior = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1),
    );
  };

  const mesSiguiente = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1),
    );
  };

  const nombreMes = fechaActual.toLocaleString("es-ES", { month: "long" });
  const anioActual = fechaActual.getFullYear();

  // Generar los días del mes dinámicamente
  const generarDiasDelMes = () => {
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();

    const primerDiaMes = new Date(year, month, 1);
    const ultimoDiaMes = new Date(year, month + 1, 0);

    let diaSemanaInicio = primerDiaMes.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

    const totalDiasMes = ultimoDiaMes.getDate();

    const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();
    const diasAnterior = [];
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const dia = ultimoDiaMesAnterior - i;
      const mesAntNum = month === 0 ? 12 : month;
      const anoAntNum = month === 0 ? year - 1 : year;
      const fechaStr = `${anoAntNum}-${String(mesAntNum).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      diasAnterior.push({ dia, fechaStr, esDelMes: false });
    }

    const diasActuales = [];
    for (let i = 1; i <= totalDiasMes; i++) {
      const mesNum = month + 1;
      const fechaStr = `${year}-${String(mesNum).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      diasActuales.push({ dia: i, fechaStr, esDelMes: true });
    }

    const totalCasillasTotales =
      Math.ceil((diasAnterior.length + diasActuales.length) / 7) * 7;
    const totalDiasSiguientes =
      totalCasillasTotales - (diasAnterior.length + diasActuales.length);

    const diasSiguientes = [];
    for (let i = 1; i <= totalDiasSiguientes; i++) {
      const mesSigNum = month + 2 > 12 ? 1 : month + 2;
      const anoSigNum = month + 2 > 12 ? year + 1 : year;
      const fechaStr = `${anoSigNum}-${String(mesSigNum).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      diasSiguientes.push({ dia: i, fechaStr, esDelMes: false });
    }

    return [...diasAnterior, ...diasActuales, ...diasSiguientes];
  };

  const diasDelCalendario = generarDiasDelMes();

  const handleSelectDay = (fechaStr) => {
    setFechaSeleccionada(fechaStr);
    if (onSeleccionarFecha) {
      onSeleccionarFecha(fechaStr);
    }
  };

  const obtenerTextoFechaLegible = (fechaStr) => {
    if (!fechaStr) return "";
    const [año, mes, dia] = fechaStr.split("-");
    const fechaObj = new Date(año, mes - 1, dia);
    return fechaObj.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  };

  return (
    <div className="space-y-4">
      {/* Contenedor del Calendario */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          {/* Botón Mes Anterior */}
          <button
            onClick={mesAnterior}
            className="p-2.5 rounded-2xl hover:bg-[#013364]/10 text-[#013364] transition-colors flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Nombre del mes y año */}
          <div className="text-center">
            <h2 className="text-[20px] font-medium capitalize text-[#013364] leading-tight">
              {nombreMes}
            </h2>
            <span className="text-xs text-black/40 font-semibold tracking-wide">
              {anioActual}
            </span>
          </div>

          {/* Botón Mes Siguiente */}
          <button
            onClick={mesSiguiente}
            className="p-2.5 rounded-2xl hover:bg-[#013364]/10 
                     text-[#013364] transition-colors flex 
                     items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[13px] font-medium leading-[16px] text-gray-400 mb-2">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>

        {/* Grilla dinámica de días */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {diasDelCalendario.map((item, index) => {
            const esSeleccionado = fechaSeleccionada === item.fechaStr;
            // Usamos el set acumulativo para que los puntos no desaparezcan al cambiar de selección
            const tienePresupuesto = fechasConPresupuestoAcumuladas.has(
              item.fechaStr,
            );

            return (
              <div
                key={index}
                onClick={() => handleSelectDay(item.fechaStr)}
                className="flex flex-col items-center justify-center cursor-pointer py-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-[15px] font-normal leading-[20px] ${
                    esSeleccionado
                      ? "bg-[#013364] text-white font-bold shadow-sm"
                      : item.esDelMes
                        ? "text-gray-800 hover:bg-gray-100"
                        : "text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.dia}</span>
                </div>

                {/* El punto verde se mantiene visible en los días que alguna vez registraron presupuesto */}
                <div className="h-2 flex items-center justify-center mt-0.5">
                  {tienePresupuesto && (
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full block shadow-sm"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección inferior: Título de la fecha y el listado */}
      <div className="mt-4">
        <div className="mb-3 px-1">
          <h3 className="text-[14px] font-semibold leading-[22px] text-[#013364] capitalize">
            {obtenerTextoFechaLegible(fechaSeleccionada)}
          </h3>
          <p className="text-xs text-[#013364]">
            {totalRegistros} Presupuestos
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <Spinner size="sm" />
          </div>
        )}

        {!loading && (
          <ClienteConPresupuesto
            presupuestos={presupuestos}
            loading={loading}
            totalRegistros={totalRegistros}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={onCambiarPagina}
          />
        )}
      </div>
    </div>
  );
}
