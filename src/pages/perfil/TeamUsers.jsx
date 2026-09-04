import { useEffect, useState } from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { PageHeader, EmptyState } from "../../components/Common";
import Modal from "../../components/Modal";

export default function TeamUsers() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function cargar() {
    setUsuarios(await api.getUsuariosEquipo(usuario.empresaId));
  }

  useEffect(() => { cargar(); }, []);

  async function guardar() {
    setError("");
    try {
      await api.crearUsuarioEquipo(usuario.empresaId, form);
      await cargar();
      setForm({ nombre: "", email: "", password: "" });
      setModalOpen(false);
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(id) {
    if (id === usuario.id) return;
    await api.eliminarUsuarioEquipo(id);
    await cargar();
  }

  return (
    <div className="app-shell">
      <PageHeader
        title="Usuarios del equipo"
        back
        action={<button onClick={() => setModalOpen(true)} className="text-primary"><Plus size={22} /></button>}
      />
      <div className="page-content px-5">
        {usuarios.length === 0 ? (
          <EmptyState icon={UserCog} title="Sin usuarios adicionales" subtitle="Invitá a alguien de tu equipo con el botón +" />
        ) : (
          <div className="flex flex-col gap-2.5 mb-8">
            {usuarios.map((u) => (
              <div key={u.id} className="bg-white border border-gray-100 rounded-xl2 p-3.5 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{u.nombre} {u.apellido} {u.id === usuario.id && <span className="text-[10px] text-primary font-semibold">(vos)</span>}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                {u.id !== usuario.id && (
                  <button onClick={() => eliminar(u.id)} className="text-rejected/70 p-1.5"><Trash2 size={15} /></button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo usuario">
        <div className="flex flex-col gap-3">
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña temporal" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {error && <p className="text-xs text-rejected">{error}</p>}
          <button onClick={guardar} className="bg-primary text-white rounded-xl py-3 text-sm font-semibold mt-1">Crear usuario</button>
        </div>
      </Modal>
    </div>
  );
}
