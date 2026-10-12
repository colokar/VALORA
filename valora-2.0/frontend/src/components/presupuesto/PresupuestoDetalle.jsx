"use client";
import { useDetallePresupuesto } from "@/hooks/useDetallePresupuesto";
import PresupuestoCard from "./PresupuestoCard";
import Loading from "@/components/ui/loading/Loading";

export default function PresupuestoDetalle({ params }) {
  const { id } = params;
  const { presupuesto, loading, actualizandoEstado, cambiarEstado } = useDetallePresupuesto(id);

  if (loading) {
    return <Loading text="Cargando presupuesto..." />;
  }

  if (!presupuesto) {
    return <p className="text-center">Presupuesto no encontrado</p>;
  }

  return (
    <div>
      <PresupuestoCard presupuesto={presupuesto} />

      <div className="mt-4 bg-white p-4 rounded-xl">
        <h3 className="font-bold text-[#0B376D] mb-2">Actualizar estado</h3>
        <select value={presupuesto.estado} disabled={actualizandoEstado} onChange={(e) => cambiarEstado(e.target.value)} className="w-full border rounded-xl p-3">
          <option>Borrador</option>
          <option>Guardado</option>
          <option>Enviado</option>
          <option>Aceptado</option>
          <option>Rechazado</option>
        </select>
      </div>
    </div>
  );
}