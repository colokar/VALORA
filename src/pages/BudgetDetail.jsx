import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Share2, SquarePen, Trash2, RefreshCcw } from "lucide-react";
import * as api from "../services/api";
import { useData } from "../context/DataContext";
import { Loader } from "../components/Common";
import StatusBadge from "../components/StatusBadge";
import ShareBudgetModal from "../components/ShareBudgetModal";
import Modal from "../components/Modal";
import { formatMonto, formatFecha } from "../utils/format";

export default function BudgetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresa, recargarPresupuestos } = useData();
  const [presupuesto, setPresupuesto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    api.getPresupuesto(id).then(setPresupuesto);
  }, [id]);

  async function eliminar() {
    setEliminando(true);
    await api.eliminarPresupuesto(id);
    await recargarPresupuestos();
    navigate("/historial");
  }

  if (!presupuesto) return <div className="app-shell"><Loader /></div>;

  const descripcionItems = presupuesto.itemsDetalle
    .map((it) => `${it.nombre} x ${it.cantidad}`)
    .join(", ");

  return (
    <div className="app-shell">
      <div className="page-content px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-500"><ChevronLeft size={24} /></button>
          <button onClick={() => setModalOpen(true)} className="text-primary"><Share2 size={20} /></button>
        </div>

        <div className="flex items-center gap-3.5 mb-5">
          <span className="vx-avatar w-[72px] h-[72px] text-2xl">
            {presupuesto.cliente?.nombre?.slice(0, 2).toUpperCase() || "CL"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-primary truncate">{presupuesto.cliente?.nombre}</p>
            <p className="text-sm text-primary/70">{presupuesto.numero}</p>
          </div>
          <StatusBadge estado={presupuesto.estado} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="vx-card-flat px-4 py-3 flex flex-col items-center text-center">
            <p className="text-xs text-gray-500">Fecha de creación</p>
            <p className="text-sm font-bold text-primary mt-0.5">{formatFecha(presupuesto.fechaCreacion, { year: "numeric" })}</p>
          </div>
          <div className="vx-card-flat px-4 py-3 flex flex-col items-center text-center">
            <p className="text-xs text-gray-500">Vence en</p>
            <p className="text-sm font-bold text-primary mt-0.5">
              {presupuesto.diasParaVencer >= 0 ? `${presupuesto.diasParaVencer} días` : "Vencido"}
            </p>
          </div>
        </div>

        <div className="vx-card-flat px-5 py-4 flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary">Total:</span>
          <span className="text-base font-bold text-primary">{formatMonto(presupuesto.monto, empresa?.moneda)}</span>
        </div>

        <div className="text-sm text-primary leading-relaxed mb-6">
          <p className="font-bold">Descripción:</p>
          <p>Servicio: {presupuesto.nombreServicio || "—"}</p>
          <p>Ítems: {descripcionItems || "—"}</p>
          <br />
          <p className="font-bold">Observación:</p>
          <p className="text-gray-500">{presupuesto.observaciones || "Sin observaciones."}</p>
        </div>

        {presupuesto.presupuestoOrigenNumero && (
          <div className="bg-gray-50 rounded-xl2 p-4 mb-4 flex items-center gap-2.5">
            <RefreshCcw size={15} className="text-primary shrink-0" />
            <p className="text-xs text-gray-500">
              Versión modificada de <span className="font-semibold text-gray-700">{presupuesto.presupuestoOrigenNumero}</span>
            </p>
          </div>
        )}

        {presupuesto.comentarioCliente && (
          <div className="bg-gray-50 rounded-xl2 p-4 mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-1">Comentario del cliente</p>
            <p className="text-sm text-gray-600">{presupuesto.comentarioCliente}</p>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          {presupuesto.estado === "borrador" && (
            <button
              onClick={() => navigate(`/nuevo-presupuesto/${id}`)}
              className="flex-1 flex items-center justify-center gap-2 vx-btn-outline-primary py-2.5"
            >
              <SquarePen size={16} /> Editar
            </button>
          )}
          {presupuesto.estado === "rechazado" && (
            <button
              onClick={() => navigate(`/nuevo-presupuesto?basadoEn=${id}`)}
              className="flex-1 flex items-center justify-center gap-2 vx-btn-outline-primary py-2.5"
            >
              <RefreshCcw size={16} /> Nuevo a partir de este
            </button>
          )}
          <button
            onClick={() => setConfirmarEliminar(true)}
            className="flex-1 flex items-center justify-center gap-2 vx-btn-outline-danger"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>

      <ShareBudgetModal open={modalOpen} onClose={() => setModalOpen(false)} presupuesto={presupuesto} empresa={empresa} />

      <Modal open={confirmarEliminar} onClose={() => setConfirmarEliminar(false)} title="¿Eliminar presupuesto?">
        <p className="text-sm text-gray-500 mb-5">
          Esta acción no se puede deshacer. Se eliminará el presupuesto {presupuesto.numero} de forma permanente.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmarEliminar(false)} className="flex-1 vx-btn-outline">Cancelar</button>
          <button
            onClick={eliminar}
            disabled={eliminando}
            className="flex-1 bg-rejected text-white rounded-2xl py-3 text-sm font-semibold disabled:opacity-60"
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
