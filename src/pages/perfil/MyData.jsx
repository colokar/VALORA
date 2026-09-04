import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { PageHeader } from "../../components/Common";

export default function MyData() {
  const { usuario, refrescarUsuario } = useAuth();
  const [form, setForm] = useState({
    nombre: usuario.nombre || "",
    apellido: usuario.apellido || "",
    email: usuario.email || "",
    telefono: usuario.telefono || "",
    cargo: usuario.cargo || "Administrador",
  });
  const [avatar, setAvatar] = useState(usuario.avatar || "");
  const [guardado, setGuardado] = useState(false);
  const fileInputRef = useRef(null);

  function elegirFoto() {
    fileInputRef.current?.click();
  }

  function onFotoSeleccionada(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  async function guardar() {
    await api.actualizarUsuario(usuario.id, { ...form, avatar });
    await refrescarUsuario();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  return (
    <div className="app-shell">
      <PageHeader title="Mis datos" back />
      <div className="page-content px-5 flex flex-col gap-3.5">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                form.nombre?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <button
              onClick={elegirFoto}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-card"
            >
              <Camera size={13} className="text-primary" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFotoSeleccionada} />
          <button onClick={elegirFoto} className="text-xs font-semibold text-primary mt-2">
            Cambiar foto
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Apellido</label>
          <input
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Teléfono</label>
          <input
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500">Cargo</label>
          <input
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <button onClick={guardar} className="mt-3 bg-primary text-white rounded-xl py-3 text-sm font-semibold mb-8">
          {guardado ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
