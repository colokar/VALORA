import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// import Logo from "../components/Logo";
import ValoraLogo from "../assets/Logo.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const u = await login(email, password);
      navigate(u.onboardingCompleto ? "/home" : "/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="app-shell login-shell">
      {/* Logo + título */}
      <div className="login-header flex flex-col items-center text-center">
        {/*<Logo size={72} />*/}
        <img src={ValoraLogo} alt="Logo VALORA" className="login-logo" />
        <b className="text-[28px] leading-9 text-primary">Bienvenido/a</b>
      </div>

      <form onSubmit={handleSubmit} className="login-form flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-base leading-6 text-primary">Correo electrónico</label>
          <div className="login-input rounded-[10px] bg-white border-[1.3px] px-4 py-2 flex items-center">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin"
              className="w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base leading-6 text-primary">Contraseña</label>
          <div className="login-input rounded-[10px] bg-white border-[1.3px] px-4 py-2 flex items-center gap-[13px]">
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent"
              required
            />
            <button type="button" onClick={() => setVerPassword((v) => !v)} className="text-gray-400 shrink-0">
              {verPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/recuperar-contrasena")}
          className="self-end text-sm font-semibold text-gray-500 mt-1"
        >
          Olvidé mi contraseña
        </button>

        {error && <p className="text-xs text-rejected font-medium">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="login-submit bg-accent hover:bg-accent-dark text-white py-2 px-4 text-base font-semibold text-center disabled:opacity-60 active:scale-[0.98] transition-transform"
        >
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-3">
        Usuario demo: <span className="font-semibold text-gray-500">admin</span> / contraseña <span className="font-semibold text-gray-500">admin</span>
      </p>

      <p className="text-center mt-9">
        <span className="text-gray-500">¿Aún no tenés cuenta? </span>
        <Link to="/registro" className="text-[18px] leading-[26px] text-accent font-semibold">
          Registrate
        </Link>
      </p>
    </div>
  );
}
