import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "./Modal";

const ESTADOS = [
  { key: "pendiente", label: "Pendientes" },
  { key: "aprobado", label: "Aprobados" },
  { key: "rechazado", label: "Rechazados" },
  { key: "borrador", label: "Borradores" },
];

const RANGOS_FECHA = [
  { key: "hoy", label: "Hoy" },
  { key: "semana", label: "Última semana" },
  { key: "mes", label: "Último mes" },
  { key: "personalizado", label: "Personalizado" },
];

export default function FilterModal({ open, onClose, filtros, onAplicar }) {
  const [local, setLocal] = useState(filtros);

  function toggleEstado(key) {
    setLocal((f) => ({
      ...f,
      estados: f.estados.includes(key) ? f.estados.filter((e) => e !== key) : [...f.estados, key],
    }));
  }

  function borrar() {
    const vacio = { estados: [], rango: null, desde: "", hasta: "", montoDesde: "", montoHasta: "" };
    setLocal(vacio);
    onAplicar(vacio);
  }

  function aplicar() {
    onAplicar(local);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Filtrar presupuestos">
      <div className="flex justify-end -mt-8 mb-3">
        <button onClick={borrar} className="text-sm font-extrabold text-accent">Borrar</button>
      </div>

      <p className="vx-section-title text-base mb-2">Estado</p>
      <div className="flex flex-col gap-2.5 mb-5">
        {ESTADOS.map((e) => {
          const activo = local.estados.includes(e.key);
          return (
            <button key={e.key} onClick={() => toggleEstado(e.key)} className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${activo ? "bg-primary border-primary" : "border-gray-300"}`}>
                {activo && <Check size={13} className="text-white" strokeWidth={3} />}
              </span>
              <span className="text-sm text-primary">{e.label}</span>
            </button>
          );
        })}
      </div>

      <p className="vx-section-title text-base mb-2">Fecha</p>
      <div className="flex flex-col gap-2.5 mb-2">
        {RANGOS_FECHA.map((r) => {
          const activo = local.rango === r.key;
          return (
            <button key={r.key} onClick={() => setLocal((f) => ({ ...f, rango: r.key }))} className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${activo ? "border-primary" : "border-gray-300"}`}>
                {activo && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
              <span className="text-sm text-primary">{r.label}</span>
            </button>
          );
        })}
      </div>

      {local.rango === "personalizado" && (
        <div className="grid grid-cols-2 gap-3 mb-5 mt-2">
          <div>
            <label className="text-xs text-primary mb-1 block">Desde</label>
            <input
              type="date"
              value={local.desde}
              onChange={(e) => setLocal((f) => ({ ...f, desde: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-xs text-gray-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-primary mb-1 block">Hasta</label>
            <input
              type="date"
              value={local.hasta}
              onChange={(e) => setLocal((f) => ({ ...f, hasta: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-xs text-gray-600 focus:outline-none"
            />
          </div>
        </div>
      )}

      <p className="vx-section-title text-base mb-2 mt-5">Monto</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs text-primary mb-1 block">Desde</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-2.5 py-2 gap-1">
            <span className="text-xs font-bold text-primary">$</span>
            <input
              type="number"
              value={local.montoDesde}
              onChange={(e) => setLocal((f) => ({ ...f, montoDesde: e.target.value }))}
              className="w-full text-xs text-gray-600 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-primary mb-1 block">Hasta</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-2.5 py-2 gap-1">
            <span className="text-xs font-bold text-primary">$</span>
            <input
              type="number"
              value={local.montoHasta}
              onChange={(e) => setLocal((f) => ({ ...f, montoHasta: e.target.value }))}
              className="w-full text-xs text-gray-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button onClick={aplicar} className="vx-btn-primary w-full">Aplicar filtro</button>
    </Modal>
  );
}
