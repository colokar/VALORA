import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import * as api from "../services/api";
import ValoraLogo from "../assets/Logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: pedir email, 2: nueva contraseña, 3: listo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function verificarEmail(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await api.solicitarRecuperacion(email);
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function restablecer(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== repetirPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    try {
      await api.restablecerPassword(email, password);
      setPaso(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="app-shell justify-center px-[18px]">
      <div className="flex flex-col items-center gap-5 mb-11 text-center">
        <img src={ValoraLogo} alt="Logo VALORA" width={100} />
        <b className="text-[28px] leading-9 text-primary">Recuperar contraseña</b>
      </div>

      {paso === 1 && (
        <form onSubmit={verificarEmail} className="flex flex-col gap-3 px-4">
          <p className="text-sm text-gray-500 mb-1">
            Ingresá el correo electrónico de tu cuenta y te vamos a ayudar a restablecer tu contraseña.
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-base leading-6 text-primary">Correo electrónico</label>
            <div className="rounded-[10px] bg-white border-[1.3px] border-black/20 px-4 py-2 flex items-center">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                className="w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent"
                required
                autoFocus
              />
            </div>
          </div>

          {error && <p className="text-xs text-rejected font-medium">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 bg-accent hover:bg-accent-dark text-white rounded-2xl py-2 px-4 text-base font-semibold text-center disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {cargando ? "Verificando..." : "Continuar"}
          </button>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={restablecer} className="flex flex-col gap-3 px-4">
          <p className="text-sm text-gray-500 mb-1">Elegí una nueva contraseña para tu cuenta.</p>
          <div className="flex flex-col gap-2">
            <label className="text-base leading-6 text-primary">Nueva contraseña</label>
            <div className="rounded-[10px] bg-white border-[1.3px] border-black/20 px-4 py-2 flex items-center gap-[13px]">
              <input
                type={verPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent"
                required
                autoFocus
              />
              <button type="button" onClick={() => setVerPassword((v) => !v)} className="text-gray-400 shrink-0">
                {verPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base leading-6 text-primary">Repetir contraseña</label>
            <div className="rounded-[10px] bg-white border-[1.3px] border-black/20 px-4 py-2 flex items-center">
              <input
                type={verPassword ? "text" : "password"}
                value={repetirPassword}
                onChange={(e) => setRepetirPassword(e.target.value)}
                placeholder="••••••"
                className="w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-rejected font-medium">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 bg-accent hover:bg-accent-dark text-white rounded-2xl py-2 px-4 text-base font-semibold text-center disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {cargando ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>
      )}

      {paso === 3 && (
        <div className="flex flex-col items-center gap-4 px-4 text-center">
          <CheckCircle2 size={48} className="text-primary" />
          <p className="text-sm text-gray-600">
            Tu contraseña se actualizó correctamente. Ya podés iniciar sesión con tu nueva contraseña.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 bg-accent hover:bg-accent-dark text-white rounded-2xl py-2 px-6 text-base font-semibold text-center active:scale-[0.98] transition-transform"
          >
            Ir a iniciar sesión
          </button>
        </div>
      )}

      {paso !== 3 && (
        <p className="text-center mt-9">
          <Link to="/login" className="text-[18px] leading-[26px] text-accent font-semibold">
            Volver a iniciar sesión
          </Link>
        </p>
      )}
    </div>
  );
}
