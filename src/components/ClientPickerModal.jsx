import { useState } from "react";
import { Search, UserPlus, ArrowLeft } from "lucide-react";
import Modal from "./Modal";

export default function ClientPickerModal({ open, onClose, clientes, onSeleccionar, onCrear }) {
  const [busqueda, setBusqueda] = useState("");
  const [creando, setCreando] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: "", empresaCliente: "", email: "", telefono: "" });

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.empresaCliente || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  function cerrar() {
    setCreando(false);
    setBusqueda("");
    setNuevo({ nombre: "", empresaCliente: "", email: "", telefono: "" });
    onClose();
  }

  async function confirmarCreacion() {
    if (!nuevo.nombre) return;
    const cliente = await onCrear(nuevo);
    onSeleccionar(cliente);
    cerrar();
  }

  return (
    <Modal open={open} onClose={cerrar} title={creando ? "Nuevo cliente" : "Buscar o crear cliente"}>
      {!creando ? (
        <>
          <div className="vx-input-row mb-3">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full text-sm focus:outline-none bg-transparent"
            />
          </div>

          <button
            onClick={() => setCreando(true)}
            className="w-full flex items-center gap-2.5 vx-btn-outline-primary mb-3 justify-center"
          >
            <UserPlus size={16} /> Crear nuevo cliente
          </button>

          <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
            {filtrados.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No encontramos clientes con ese nombre.</p>
            )}
            {filtrados.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSeleccionar(c);
                  cerrar();
                }}
                className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5 text-left"
              >
                <span className="vx-avatar w-9 h-9 text-xs">
                  {c.nombre.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{c.nombre}</p>
                  <p className="text-xs text-gray-400 truncate">{c.empresaCliente}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <button onClick={() => setCreando(false)} className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <ArrowLeft size={14} /> Volver a la búsqueda
          </button>
          <input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Nombre completo" className="vx-input" />
          <input value={nuevo.empresaCliente} onChange={(e) => setNuevo({ ...nuevo, empresaCliente: e.target.value })} placeholder="Empresa (opcional)" className="vx-input" />
          <input value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} placeholder="Email" className="vx-input" />
          <input value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} placeholder="Teléfono" className="vx-input" />
          <button onClick={confirmarCreacion} className="vx-btn-primary mt-1">Crear y seleccionar</button>
        </div>
      )}
    </Modal>
  );
}
