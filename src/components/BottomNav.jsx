import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, FileClock, User, Plus } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const seccionActiva = (() => {
    const p = location.pathname;
    if (p.startsWith("/home") || p.startsWith("/dashboard")) return "home";
    if (p.startsWith("/nuevo-presupuesto")) return "nuevo";
    if (p.startsWith("/historial") || p.startsWith("/presupuesto")) return "historial";
    if (p.startsWith("/perfil")) return "perfil";
    return "";
  })();

  function itemClass(seccion) {
    return `flex flex-col items-center justify-center gap-1 flex-1 py-2.5 text-[11px] font-medium transition-colors ${seccionActiva === seccion ? "text-primary" : "text-gray-400"
      }`;
  }

  function iconWrap(seccion) {
    return `w-9 h-9 rounded-full flex items-center justify-center transition-colors ${seccionActiva === seccion ? "bg-primary/10" : ""
      }`;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 shadow-nav z-40">
      <div className="flex items-stretch">
        <button onClick={() => navigate("/home")} className={itemClass("home")}>
          <span className={iconWrap("home")}>
            <Home size={20} strokeWidth={2.2} />
          </span>
          Home
        </button>

        {/* <button onClick={() => navigate("/nuevo-presupuesto")} className={itemClass("nuevo-presupuesto")}>
          <span className={iconWrap("nuevo-presupuesto")}>
            <Plus size={22} strokeWidth={2.5} />
          </span>
          Nuevo Presupuesto
        </button> */}

        <button
          onClick={() => navigate("/nuevo-presupuesto")}
          className={itemClass("nuevo")}
        >
          <span
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${seccionActiva === "nuevo"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-400"
              }`}
          >
            <Plus size={20} strokeWidth={2.4} />
          </span>
          Nuevo Presupuesto
        </button>

        <button onClick={() => navigate("/historial")} className={itemClass("historial")}>
          <span className={iconWrap("historial")}>
            <FileClock size={20} strokeWidth={2.2} />
          </span>
          Historial
        </button>

        <button onClick={() => navigate("/perfil")} className={itemClass("perfil")}>
          <span className={iconWrap("perfil")}>
            <User size={20} strokeWidth={2.2} />
          </span>
          Perfil
        </button>
      </div>
    </nav>
  );
}
