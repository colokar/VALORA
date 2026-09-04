import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { PageHeader } from "../../components/Common";

const OPCIONES = [
  { key: "email", label: "Notificaciones por email", sub: "Cuando un cliente aprueba, rechaza o comenta" },
  { key: "push", label: "Notificaciones push", sub: "Alertas dentro de la app" },
  { key: "whatsapp", label: "Notificaciones por WhatsApp", sub: "Avisos de vencimiento próximo" },
];

export default function Notifications() {
  const { usuario, refrescarUsuario } = useAuth();

  async function toggle(key) {
    const nuevas = { ...usuario.notificaciones, [key]: !usuario.notificaciones[key] };
    await api.actualizarUsuario(usuario.id, { notificaciones: nuevas });
    await refrescarUsuario();
  }

  return (
    <div className="app-shell">
      <PageHeader title="Notificaciones" back />
      <div className="page-content px-5">
        <div className="bg-white border border-gray-100 rounded-xl2 shadow-card overflow-hidden">
          {OPCIONES.map((o) => (
            <div key={o.key} className="flex items-center justify-between px-4 py-4 border-b border-gray-50 last:border-b-0">
              <div className="pr-3">
                <p className="text-sm font-medium text-gray-700">{o.label}</p>
                <p className="text-xs text-gray-400">{o.sub}</p>
              </div>
              <button
                onClick={() => toggle(o.key)}
                className={`w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-colors ${usuario.notificaciones[o.key] ? "bg-primary justify-end" : "bg-gray-200 justify-start"}`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
