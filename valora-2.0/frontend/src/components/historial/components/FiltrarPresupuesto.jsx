"use client";

import { useState } from "react";

export default function FiltrarPresupuesto({
  onClose,
  onAplicar,
  filtrosIniciales,
}) {
  // Inicializamos vacíos para que no aplique ningún filtro por defecto
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(
    filtrosIniciales?.periodoSeleccionado || "",
  );
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(
    filtrosIniciales?.estado || "",
  );
  const [montoMin, setMontoMin] = useState(filtrosIniciales?.montoMin || "");
  const [montoMax, setMontoMax] = useState(filtrosIniciales?.montoMax || "");

  const [fechaInicio, setFechaInicio] = useState(
    filtrosIniciales?.fechaInicio || "",
  );
  const [fechaFin, setFechaFin] = useState(filtrosIniciales?.fechaFin || "");

  const seleccionarPeriodo = (tipo) => {
    // Si hace clic en el mismo periodo que ya estaba activo, lo deselecciona
    if (periodoSeleccionado === tipo) {
      setPeriodoSeleccionado("");
      setFechaInicio("");
      setFechaFin("");
      return;
    }

    setPeriodoSeleccionado(tipo);
    const hoy = new Date();
    let inicio = new Date();

    if (tipo === "hoy") {
      inicio = hoy;
    } else if (tipo === "semana") {
      inicio.setDate(hoy.getDate() - 7);
    } else if (tipo === "mes") {
      inicio.setMonth(hoy.getMonth() - 1);
    } else {
      return;
    }

    const formatear = (d) => d.toISOString().split("T")[0];
    setFechaInicio(formatear(inicio));
    setFechaFin(formatear(hoy));
  };

  const handleBorrar = () => {
    setPeriodoSeleccionado("");
    setEstadoSeleccionado("");
    setMontoMin("");
    setMontoMax("");
    setFechaInicio("");
    setFechaFin("");
  };

  const handleAplicar = () => {
    onAplicar({
      fechaInicio,
      fechaFin,
      estado: estadoSeleccionado,
      montoMin,
      montoMax,
      periodoSeleccionado,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-end">
      {/* Panel lateral */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* Cabecera */}
        <div className="relative flex justify-between items-center p-2 border-b border-gray-100 flex-shrink-0 bg-white">
          {/* Botón Cerrar (Izquierda) */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
          >
            <span className="font-bold text-lg leading-none">✕</span>
          </button>

          {/* Título (Centro absoluto) */}
          <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-[#013364]">
            Filtrar presupuestos
          </h2>

          {/* Botón Borrar (Derecha) */}
          <button
            onClick={handleBorrar}
            className="text-red-600 font-medium text-sm hover:text-red-700 hover:underline z-10 transition-colors"
          >
            Borrar
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 p-3 space-y-5">
          {/* ESTADOS */}
          <div>
            <h3 className="text-sm font-semibold text-[#013364] mb-3">
              Estado
            </h3>
            <div className="flex flex-col">
              {[
                { label: "Pendientes", val: "Pendiente" },
                { label: "Aprobados", val: "Aceptado" },
                { label: "Rechazados", val: "Rechazado" },
                { label: "Borradores", val: "Borrador" },
              ].map((est) => {
                const activo = estadoSeleccionado === est.val;
                return (
                  <button
                    key={est.val}
                    onClick={() => setEstadoSeleccionado(activo ? "" : est.val)}
                    className={`flex items-center gap-3 text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                      activo
                        ? "bg-[#013364]/10 text-[#013364] font-bold shadow-sm"
                        : "text-black/30 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {/* Caja de selección / Checkbox personalizado */}
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                        activo
                          ? "bg-[#013364] border-[#013364] text-white"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {activo && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{est.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* PERIODO DE TIEMPO */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#013364] mb-3">
              Fecha
            </h3>
            <div className="flex flex-col">
              {[
                { id: "hoy", label: "Hoy" },
                { id: "semana", label: "Última semana" },
                { id: "mes", label: "Último mes" },
                { id: "personalizado", label: "Personalizado" },
              ].map((item) => {
                const activo = periodoSeleccionado === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => seleccionarPeriodo(item.id)}
                    className={`flex items-center gap-3 text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all w-full ${
                      activo
                        ? "bg-[#013364]/10 text-[#013364] font-bold shadow-sm"
                        : "text-black/30 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {/* Círculo de Radio personalizado con su punto central */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                        activo ? "border-[#013364]" : "border-gray-200 bg-white"
                      }`}
                    >
                      {activo && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#013364]" />
                      )}
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FECHA PERSONALIZADA */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div>
                <label className="text-xs text-[#013364] mb-1 block">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    setPeriodoSeleccionado("personalizado");
                  }}
                  className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-[#013364] mb-1 block">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => {
                    setFechaFin(e.target.value);
                    setPeriodoSeleccionado("personalizado");
                  }}
                  className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* MONTO */}
          <div>
            <h3 className="text-sm font-semibold text-[#013364] mb-3">Monto</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#013364] mb-1 block">
                  Desde
                </label>
                <input
                  type="number"
                  placeholder="$"
                  value={montoMin}
                  onChange={(e) => setMontoMin(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-[#013364] mb-1 block">
                  Hasta
                </label>
                <input
                  type="number"
                  placeholder="$"
                  value={montoMax}
                  onChange={(e) => setMontoMax(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white rounded-xl border border-gray-200 text-[#013364]"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN APLICAR */}
          <div className="pt-4 pb-6">
            <button
              onClick={handleAplicar}
              className="w-full py-3.5 bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-800 transition-all"
            >
              Aplicar filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
