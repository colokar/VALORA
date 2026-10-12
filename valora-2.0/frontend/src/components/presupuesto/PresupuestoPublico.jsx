"use client";
import { useEffect, useState } from "react";
import { getPresupuestoPublicoService, updateEstadoPublicoService } from "@/services/presupuestoPublico.service";
import PresupuestoCard from "./PresupuestoCard";

export default function PresupuestoPublico({ presupuestoId }) {
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    if (presupuestoId) {
      getPresupuestoPublicoService(presupuestoId)
        .then((data) => {
          setPresupuesto(data);
        })
        .catch(() => {
          setPresupuesto(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [presupuestoId]);

  async function cambiarEstado(estado) {
    try {
      setActualizando(true);
      const actualizado = await updateEstadoPublicoService(presupuestoId, estado);
      setPresupuesto(actualizado);
    } catch {
    } finally {
      setActualizando(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando presupuesto...</p>
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Presupuesto no encontrado</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <PresupuestoCard presupuesto={presupuesto} />

      {(presupuesto.estado === "Guardado" || presupuesto.estado === "Enviado") && (
        <div className="flex gap-4 mt-4">
          <button onClick={() => cambiarEstado("Aceptado")} disabled={actualizando} className="flex-1 bg-[#528A72] text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold text-sm shadow-sm transition-all">
            {actualizando ? "Actualizando..." : "Aceptar"}
          </button>

          <button onClick={() => cambiarEstado("Rechazado")} disabled={actualizando} className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold text-sm shadow-sm transition-all">
            {actualizando ? "Actualizando..." : "Rechazar"}
          </button>
        </div>
      )}

      {(presupuesto.estado === "Aceptado" || presupuesto.estado === "Rechazado") && presupuesto.updated_at && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[20px] p-4 text-center font-medium mt-4">
          <p className="text-center text-xs text-gray-500">
            Presupuesto {presupuesto.estado.toLowerCase()} el{" "}
            {new Date(presupuesto.updated_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
            {" a las "}
            {new Date(presupuesto.updated_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}
            hs.
          </p>
        </div>
      )}
    </section>
  );
}