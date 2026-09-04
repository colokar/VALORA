import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import { PageHeader } from "../../components/Common";

const CAMPOS = [
  { key: "nombre", label: "Razón social (nombre de la empresa)" },
  { key: "rubro", label: "Rubro" },
  { key: "cuit", label: "CUIL / CUIT" },
  { key: "direccion", label: "Dirección" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Email" },
  { key: "sitioWeb", label: "Sitio web" },
];

export default function MyCompany() {
  const { empresa, setEmpresa } = useData();
  const [form, setForm] = useState(empresa || {});
  const [guardado, setGuardado] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => setForm(empresa || {}), [empresa]);

  function elegirLogo() {
    fileInputRef.current?.click();
  }

  function onLogoSeleccionado(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result }));
    reader.readAsDataURL(file);
  }

  async function guardar() {
    const actualizada = await api.actualizarEmpresa(empresa.id, form);
    setEmpresa(actualizada);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  if (!empresa) return null;

  return (
    <div className="app-shell">
      <PageHeader title="Mi empresa" back />
      <div className="page-content px-5 flex flex-col gap-3.5">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold overflow-hidden">
              {form.logo ? (
                <img src={form.logo} alt="Logo de la empresa" className="w-full h-full object-cover" />
              ) : (
                form.nombre?.[0]?.toUpperCase() || "E"
              )}
            </div>
            <button
              onClick={elegirLogo}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-card"
            >
              <Camera size={13} className="text-primary" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onLogoSeleccionado} />
          <button onClick={elegirLogo} className="text-xs font-semibold text-primary mt-2">Cambiar logo</button>
        </div>

        {CAMPOS.map((c) => (
          <div key={c.key}>
            <label className="text-xs font-semibold text-gray-500">{c.label}</label>
            <input
              value={form[c.key] || ""}
              onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        ))}

        <button onClick={guardar} className="mt-3 bg-primary text-white rounded-xl py-3 text-sm font-semibold mb-8">
          {guardado ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
