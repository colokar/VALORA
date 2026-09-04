import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// import Logo from "../components/Logo";
// import Logo from "../components/Logo";
import ValoraLogo from "../assets/Logo.png";

const CAMPO_BASE =
  "w-full text-base leading-6 text-gray-500 focus:outline-none bg-transparent";
const INPUT_BASE =
  "rounded-[10px] bg-white border-[1.3px] border-gray-500/70 px-4 py-2 flex items-center";

export default function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", apellido: "", empresaNombre: "", email: "",
    password: "", repetirPassword: "",
  });
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetir, setVerRepetir] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function update(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.repetirPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!aceptaTerminos) {
      setError("Tenés que aceptar los términos y condiciones.");
      return;
    }

    setCargando(true);
    try {
      await registrar(form);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="app-shell bg-[#fdfdfd] justify-start px-[18px] pt-6">
      <div className="flex flex-col items-center gap-5 mb-9 text-center">
        {/* <Logo size={72} /> */}
        <img src={ValoraLogo} alt="Logo VALORA" width={100} />
        <b className="text-[28px] leading-9 text-primary">Registrate</b>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="w-full max-w-[306px] flex flex-col gap-3">
          <Campo label="Nombre" required>
            <input value={form.nombre} onChange={(e) => update("nombre", e.target.value)} placeholder="Agustín" className={CAMPO_BASE} required />
          </Campo>
          <Campo label="Apellido" required>
            <input value={form.apellido} onChange={(e) => update("apellido", e.target.value)} placeholder="López" className={CAMPO_BASE} required />
          </Campo>
          <Campo label="Nombre de la Empresa" required>
            <input value={form.empresaNombre} onChange={(e) => update("empresaNombre", e.target.value)} placeholder="Servicios Arg" className={CAMPO_BASE} required />
          </Campo>
        </div>

        <div className="w-full max-w-[306px] flex flex-col gap-3">
          <Campo label="Correo electrónico" required>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="alopez@serviciosarg.com.ar" className={`${CAMPO_BASE} text-sm`} required />
          </Campo>

          <Campo label="Contraseña" required>
            <input
              type={verPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••"
              className={CAMPO_BASE}
              required
            />
            <button type="button" onClick={() => setVerPassword((v) => !v)} className="text-gray-400 shrink-0">
              {verPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </Campo>

          <p className="text-sm leading-[160%] tracking-[0.14px] text-accent font-bold">
            *Debe tener un mínimo de 6 a 8 caracteres.
            <br />
            *Incluir una combinación de letras mayúsculas, minúsculas, números.
          </p>

          <Campo label="Repetir contraseña" required>
            <input
              type={verRepetir ? "text" : "password"}
              value={form.repetirPassword}
              onChange={(e) => update("repetirPassword", e.target.value)}
              placeholder="••••••"
              className={CAMPO_BASE}
              required
            />
            <button type="button" onClick={() => setVerRepetir((v) => !v)} className="text-gray-400 shrink-0">
              {verRepetir ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </Campo>
        </div>

        {error && <p className="text-xs text-rejected font-medium w-full max-w-[306px]">{error}</p>}

        <label className="w-full max-w-[306px] flex items-center gap-2 mt-2 cursor-pointer">
          <button
            type="button"
            onClick={() => setAceptaTerminos((v) => !v)}
            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${aceptaTerminos ? "bg-accent border-accent" : "border-gray-400"}`}
          >
            {aceptaTerminos && <Check size={12} className="text-white" strokeWidth={3} />}
          </button>
          <span className="text-sm text-primary">Aceptar los términos y condiciones</span>
        </label>

        <button
          type="submit"
          disabled={cargando}
          className="w-full max-w-[306px] bg-accent hover:bg-accent-dark text-white rounded-2xl py-2 px-4 text-base font-semibold text-center disabled:opacity-60 active:scale-[0.98] transition-transform mt-1 mb-4"
        >
          {cargando ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mb-8">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-accent font-semibold">Ingresá</Link>
      </p>
    </div>
  );
}

function Campo({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base leading-6 text-gray-700">
        {label} {required && <span className="text-rejected">*</span>}
      </label>
      <div className={INPUT_BASE + " gap-3"}>{children}</div>
    </div>
  );
}
