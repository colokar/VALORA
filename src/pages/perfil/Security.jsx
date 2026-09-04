import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { PageHeader } from "../../components/Common";

export default function Security() {
  const { usuario, refrescarUsuario } = useAuth();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function cambiarPassword() {
    setError("");
    try {
      await api.cambiarPassword(usuario.id, actual, nueva);
      setOk(true);
      setActual("");
      setNueva("");
      setTimeout(() => setOk(false), 2000);
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggle2FA() {
    await api.actualizarUsuario(usuario.id, { twoFactor: !usuario.twoFactor });
    await refrescarUsuario();
  }

  return (
    <div className="app-shell">
      <PageHeader title="Seguridad" back />
      <div className="page-content px-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Cambiar contraseña</h3>
        <div className="flex flex-col gap-3 mb-6">
          <input
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            placeholder="Contraseña actual"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            placeholder="Nueva contraseña"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && <p className="text-xs text-rejected">{error}</p>}
          <button onClick={cambiarPassword} className="bg-primary text-white rounded-xl py-3 text-sm font-semibold">
            {ok ? "Actualizada ✓" : "Actualizar contraseña"}
          </button>
        </div>

        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Verificación en dos pasos</h3>
        <div className="bg-white border border-gray-100 rounded-xl2 p-4 flex items-center justify-between shadow-card mb-8">
          <div>
            <p className="text-sm font-medium text-gray-700">2FA por email</p>
            <p className="text-xs text-gray-400">Te pediremos un código extra al iniciar sesión</p>
          </div>
          <button
            onClick={toggle2FA}
            className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${usuario.twoFactor ? "bg-primary justify-end" : "bg-gray-200 justify-start"}`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow" />
          </button>
        </div>
      </div>
    </div>
  );
}
