import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import * as api from "../services/api";
import { formatMonto, formatFecha } from "../utils/format";
import StatusBadge from "../components/StatusBadge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PublicBudget() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarComentario, setMostrarComentario] = useState(false);
  const esImpresion = searchParams.get("print") === "1";

  useEffect(() => {
    api.getPresupuesto(id).then(setPresupuesto);
  }, [id]);

  useEffect(() => {
    if (esImpresion && presupuesto) setTimeout(() => window.print(), 400);
  }, [esImpresion, presupuesto]);

  async function responder(estado) {
    setEnviando(true);
    const actualizado = await api.actualizarEstadoPresupuesto(id, estado, comentario);
    setPresupuesto(actualizado);
    setEnviando(false);
    setMostrarComentario(false);
  }

  if (!presupuesto) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Cargando presupuesto...</div>;
  }

  const respondido = presupuesto.estado === "aprobado" || presupuesto.estado === "rechazado";
  const iniciales = (presupuesto.empresa?.nombre || "VA").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-card p-8 sm:p-10 print:shadow-none print:p-0">
        {/* Encabezado */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Presupuesto</h1>
            <p className="text-sm text-gray-400 mt-1">#{presupuesto.numero}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-primary flex flex-col items-center justify-center text-primary shrink-0 overflow-hidden">
            {presupuesto.empresa?.logo ? (
              <img src={presupuesto.empresa.logo} alt={presupuesto.empresa?.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-extrabold leading-none">{iniciales}</span>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="flex flex-col gap-1.5 mb-8">
          <div className="flex gap-3 text-sm">
            <span className="text-gray-500 w-28">Fecha</span>
            <span className="font-bold text-gray-800">{formatFecha(presupuesto.fechaCreacion, { year: "numeric" })}</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-gray-500 w-28">Vencimiento</span>
            <span className="font-bold text-gray-800">{formatFecha(presupuesto.fechaVencimiento, { year: "numeric" })}</span>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Cliente / Empresa */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-bold text-gray-800 mb-2">Cliente</p>
            <p className="text-sm font-semibold text-gray-800">{presupuesto.cliente?.nombre}</p>
            <p className="text-sm text-gray-500">{presupuesto.cliente?.email}</p>
            <p className="text-sm text-gray-500">{presupuesto.cliente?.telefono}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 mb-2">{presupuesto.empresa?.nombre}</p>
            <p className="text-sm text-gray-500">{presupuesto.empresa?.email}</p>
            <p className="text-sm text-gray-500">{presupuesto.empresa?.telefono}</p>
          </div>
        </div>

        {/* Tabla de ítems */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-200">
              <th className="font-bold pb-2 text-gray-700">Descripción</th>
              <th className="font-bold pb-2 text-center text-gray-700">Cantidad</th>
              <th className="font-bold pb-2 text-right text-gray-700">Precio unitario</th>
              <th className="font-bold pb-2 text-right text-gray-700">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.itemsDetalle.map((it, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-b-0">
                <td className="py-3">
                  <p className="font-semibold text-gray-800">{presupuesto.nombreServicio || it.nombre}</p>
                  {presupuesto.nombreServicio && <p className="text-xs text-gray-400">{it.nombre}</p>}
                </td>
                <td className="py-3 text-center text-gray-600">{it.cantidad}</td>
                <td className="py-3 text-right text-gray-600">{formatMonto(it.precio, presupuesto.empresa?.moneda)}</td>
                <td className="py-3 text-right font-semibold text-gray-800">{formatMonto(it.precio * it.cantidad, presupuesto.empresa?.moneda)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="bg-gray-100 rounded-lg px-5 py-2.5 flex items-center gap-8">
            <span className="text-sm font-bold text-gray-800">TOTAL:</span>
            <span className="text-lg font-extrabold text-gray-900">{formatMonto(presupuesto.monto, presupuesto.empresa?.moneda)}</span>
          </div>
        </div>

        {presupuesto.observaciones && (
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">Observaciones: </span>{presupuesto.observaciones}
          </p>
        )}

        <div className="flex items-center gap-3 mb-6 print:hidden">
          <StatusBadge estado={presupuesto.estado} />
          {presupuesto.comentarioCliente && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-600">Comentario: </span>{presupuesto.comentarioCliente}
            </p>
          )}
        </div>

        {/* Acciones */}
        {!esImpresion && !respondido && (
          <div className="print:hidden border-t border-gray-100 pt-6">
            <div className="flex gap-3">
              <button
                onClick={() => responder("rechazado")}
                disabled={enviando}
                className="flex-1 flex items-center justify-center gap-1.5 border border-rejected/30 text-rejected rounded-xl py-3 text-sm font-semibold"
              >
                <XCircle size={16} /> Rechazar
              </button>
              <button
                onClick={() => responder("aprobado")}
                disabled={enviando}
                className="flex-1 vx-btn-primary flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} /> Aprobar
              </button>
            </div>
            <button onClick={() => setMostrarComentario((v) => !v)} className="w-full text-xs text-gray-400 mt-3 underline">
              {mostrarComentario ? "Ocultar comentario" : "Agregar un comentario antes de responder"}
            </button>
            {mostrarComentario && (
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí tu comentario (opcional)..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
              />
            )}
          </div>
        )}

        {!esImpresion && respondido && (
          <p className="text-center text-sm text-gray-500 print:hidden border-t border-gray-100 pt-6">
            Ya respondiste este presupuesto.
          </p>
        )}
      </div>
    </div>
  );
}
