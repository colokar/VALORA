import { useState } from "react";
import { Plus, Trash2, Pencil, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import { PageHeader, EmptyState } from "../../components/Common";
import Modal from "../../components/Modal";

const VACIO = { nombre: "", empresaCliente: "", email: "", telefono: "", direccion: "" };

export default function Clients() {
  const { usuario } = useAuth();
  const { clientes, recargarClientes } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);

  function abrirNuevo() {
    setEditando(null);
    setForm(VACIO);
    setModalOpen(true);
  }

  function abrirEditar(c) {
    setEditando(c);
    setForm(c);
    setModalOpen(true);
  }

  async function guardar() {
    if (!form.nombre) return;
    if (editando) {
      await api.actualizarCliente(editando.id, form);
    } else {
      await api.crearCliente(usuario.empresaId, form);
    }
    await recargarClientes();
    setModalOpen(false);
  }

  async function eliminar(id) {
    await api.eliminarCliente(id);
    await recargarClientes();
  }

  return (
    <div className="app-shell">
      <PageHeader
        title="Mis clientes"
        back
        action={
          <button onClick={abrirNuevo} className="text-primary">
            <Plus size={22} />
          </button>
        }
      />
      <div className="page-content px-5">
        {clientes.length === 0 ? (
          <EmptyState icon={Users} title="Sin clientes guardados" subtitle="Agregá el primero con el botón +" />
        ) : (
          <div className="flex flex-col gap-2.5 mb-8">
            {clientes.map((c) => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-xl2 p-3.5 shadow-card flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{c.nombre}</p>
                  <p className="text-xs text-gray-400 truncate">{c.empresaCliente} · {c.email}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => abrirEditar(c)} className="text-gray-400 p-1.5"><Pencil size={15} /></button>
                  <button onClick={() => eliminar(c.id)} className="text-rejected/70 p-1.5"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? "Editar cliente" : "Nuevo cliente"}>
        <div className="flex flex-col gap-3">
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.empresaCliente} onChange={(e) => setForm({ ...form, empresaCliente: e.target.value })} placeholder="Empresa (opcional)" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Teléfono" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={guardar} className="bg-primary text-white rounded-xl py-3 text-sm font-semibold mt-1">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
