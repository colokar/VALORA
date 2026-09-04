import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import { PageHeader, EmptyState } from "../../components/Common";
import Modal from "../../components/Modal";
import { formatMonto } from "../../utils/format";
import { Package } from "lucide-react";

const VACIO = { tipo: "servicio", nombre: "", precio: "", unidad: "", stock: "" };

export default function Items() {
  const { usuario } = useAuth();
  const { items, empresa, recargarItems } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);

  function abrirNuevo() {
    setEditando(null);
    setForm(VACIO);
    setModalOpen(true);
  }

  function abrirEditar(item) {
    setEditando(item);
    setForm(item);
    setModalOpen(true);
  }

  async function guardar() {
    if (!form.nombre || !form.precio) return;
    const datos = {
      ...form,
      precio: Number(form.precio),
      stock: form.tipo === "producto" ? Number(form.stock) || 0 : undefined,
    };
    if (editando) {
      await api.actualizarItem(editando.id, datos);
    } else {
      await api.crearItem(usuario.empresaId, datos);
    }
    await recargarItems();
    setModalOpen(false);
  }

  async function eliminar(id) {
    await api.eliminarItem(id);
    await recargarItems();
  }

  async function toggleActivo(item) {
    await api.actualizarItem(item.id, { activo: !item.activo });
    await recargarItems();
  }

  return (
    <div className="app-shell">
      <PageHeader
        title="Productos y servicios"
        back
        action={
          <button onClick={abrirNuevo} className="text-primary">
            <Plus size={22} />
          </button>
        }
      />
      <div className="page-content px-5">
        {items.length === 0 ? (
          <EmptyState icon={Package} title="Sin productos ni servicios" subtitle="Agregá el primero con el botón +" />
        ) : (
          <div className="flex flex-col gap-2.5 mb-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl2 p-3.5 shadow-card flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{item.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {formatMonto(item.precio, empresa?.moneda)} · por {item.unidad} · <span className="capitalize">{item.tipo}</span>
                    {item.tipo === "producto" && (
                      <> · stock: <span className={`font-semibold ${Number(item.stock) > 0 ? "text-gray-500" : "text-rejected"}`}>{item.stock ?? 0}</span></>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActivo(item)}
                    className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${item.activo ? "bg-primary justify-end" : "bg-gray-200 justify-start"}`}
                    title={item.activo ? "Activo" : "Inactivo"}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                  <button onClick={() => abrirEditar(item)} className="text-gray-400 p-1.5"><Pencil size={15} /></button>
                  <button onClick={() => eliminar(item.id)} className="text-rejected/70 p-1.5"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? "Editar ítem" : "Nuevo ítem"}>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {["servicio", "producto"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, tipo: t })}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border capitalize ${form.tipo === t ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="number"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            placeholder="Precio"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            value={form.unidad}
            onChange={(e) => setForm({ ...form, unidad: e.target.value })}
            placeholder="Unidad (hora, proyecto, mes...)"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {form.tipo === "producto" && (
            <input
              type="number"
              min={0}
              value={form.stock ?? ""}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="Stock disponible"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <button onClick={guardar} className="bg-primary text-white rounded-xl py-3 text-sm font-semibold mt-1">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}
