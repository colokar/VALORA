import { useState } from "react";
import { Link2, FileDown, Check, Copy } from "lucide-react";
import Modal from "./Modal";
import { formatMonto, formatFecha } from "../utils/format";

export default function ShareBudgetModal({ open, onClose, presupuesto, empresa }) {
  const [copiado, setCopiado] = useState(false);
  if (!presupuesto) return null;

  const linkPublico = `${window.location.origin}/p/${presupuesto.id}`;

  function copiarLink() {
    navigator.clipboard?.writeText(linkPublico);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  function descargarPdf() {
    // MVP: generamos una vista imprimible; el usuario puede "Guardar como PDF"
    // desde el diálogo de impresión del navegador. Misma estructura visual
    // que la vista pública compartida por link.
    window.open(`${window.location.origin}/p/${presupuesto.id}?print=1`, "_blank");
  }

  return (
    <Modal open={open} onClose={onClose} title="Presupuesto creado satisfactoriamente">
      <div className="bg-primary/5 rounded-xl2 p-4 mb-5">
        <p className="text-xs text-gray-500">{presupuesto.numero} · {presupuesto.cliente?.nombre}</p>
        <p className="text-xl font-extrabold text-primary mt-1">{formatMonto(presupuesto.monto, empresa?.moneda)}</p>
        <p className="text-[11px] text-gray-400 mt-1">Válido hasta el {formatFecha(presupuesto.fechaVencimiento)}</p>
      </div>

      <p className="text-xs font-semibold text-gray-500 mb-2">Compartir con {presupuesto.cliente?.nombre?.split(" ")[0]}</p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={copiarLink}
          className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 active:scale-[0.98] transition-transform"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <Link2 size={18} className="text-primary" />
            Copiar link para el cliente
          </span>
          {copiado ? <Check size={18} className="text-approved" /> : <Copy size={16} className="text-gray-400" />}
        </button>

        <button
          onClick={descargarPdf}
          className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 active:scale-[0.98] transition-transform"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <FileDown size={18} className="text-primary" />
            Descargar / compartir como PDF
          </span>
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
        El link lleva a una página donde tu cliente puede ver el detalle, aprobar o rechazar el
        presupuesto y dejar un comentario. El PDF tiene el mismo diseño, con tus datos y los de tu empresa.
      </p>

      <button onClick={onClose} className="w-full mt-5 bg-primary text-white rounded-xl py-3 text-sm font-semibold">
        Listo
      </button>
    </Modal>
  );
}
