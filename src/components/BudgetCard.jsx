import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatMonto, diasRestantesTexto, creadoRelativoTexto } from "../utils/format";

export default function BudgetCard({ presupuesto }) {
  const navigate = useNavigate();
  const p = presupuesto;
  const esFinal = p.estado === "aprobado" || p.estado === "rechazado";

  return (
    <button
      onClick={() => navigate(`/presupuesto/${p.id}`)}
      className="w-full text-left vx-card-flat p-4 flex items-start gap-3.5 active:scale-[0.99] transition-transform"
    >
      <span className="vx-avatar w-[54px] h-[54px] text-base shrink-0">
        {p.cliente?.nombre?.slice(0, 2).toUpperCase() || "CL"}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base font-semibold text-primary truncate">{p.cliente?.nombre || "Cliente"}</p>
            <p className="text-sm text-primary/70">{p.numero}</p>
          </div>
          <StatusBadge estado={p.estado} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarDays size={14} className="text-gray-400" />
            {creadoRelativoTexto(p.fechaCreacion)}
          </span>
          {!esFinal && (
            <span className="text-xs font-medium text-accent">{diasRestantesTexto(p.diasParaVencer, p.estado)}</span>
          )}
        </div>
        <p className="text-sm font-semibold text-primary text-right mt-1">{formatMonto(p.monto)}</p>
      </div>
    </button>
  );
}
