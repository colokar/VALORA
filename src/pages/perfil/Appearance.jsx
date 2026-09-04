import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { PageHeader } from "../../components/Common";
import { Check } from "lucide-react";

const TEMAS = [
  { key: "claro", label: "Claro", desc: "Fondo blanco, ideal para uso diurno" },
  { key: "oscuro", label: "Oscuro", desc: "Próximamente" },
];

export default function Appearance() {
  const { usuario, refrescarUsuario } = useAuth();

  async function seleccionar(tema) {
    if (tema === "oscuro") return; // fuera de alcance del MVP
    await api.actualizarUsuario(usuario.id, { apariencia: { tema } });
    await refrescarUsuario();
  }

  return (
    <div className="app-shell">
      <PageHeader title="Apariencia" back />
      <div className="page-content px-5 flex flex-col gap-3">
        {TEMAS.map((t) => {
          const activo = usuario.apariencia.tema === t.key;
          return (
            <button
              key={t.key}
              onClick={() => seleccionar(t.key)}
              disabled={t.key === "oscuro"}
              className={`flex items-center justify-between border rounded-xl2 p-4 text-left disabled:opacity-40 ${activo ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-700">{t.label}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
              {activo && <Check size={18} className="text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
