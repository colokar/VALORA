import { useNavigate } from "react-router-dom";
import {
  User, Building2, ShieldCheck, Package, Users, Bell, Palette,
  HelpCircle, FileText, Info, ChevronRight, LogOut, UserCog,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

function Section({ titulo, children }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">{titulo}</p>
      <div className="bg-white border border-gray-100 rounded-xl2 shadow-card overflow-hidden">{children}</div>
    </div>
  );
}

function Item({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-b-0 active:bg-gray-50"
    >
      <Icon size={18} className={danger ? "text-rejected" : "text-primary"} />
      <span className={`flex-1 text-left text-sm font-medium ${danger ? "text-rejected" : "text-gray-700"}`}>{label}</span>
      {!danger && <ChevronRight size={16} className="text-gray-300" />}
    </button>
  );
}

export default function Profile() {
  const { usuario, cerrarSesion } = useAuth();
  const { empresa } = useData();
  const navigate = useNavigate();

  async function handleLogout() {
    await cerrarSesion();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <div className="page-content px-5 pt-6">
        {/* Encabezado usuario */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold overflow-hidden shrink-0">
            {usuario?.avatar ? (
              <img src={usuario.avatar} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              usuario?.nombre?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">{usuario?.nombre} {usuario?.apellido}</h1>
            <p className="text-xs text-gray-400">{usuario?.cargo ? `${usuario.cargo} · ` : ""}{empresa?.nombre}</p>
          </div>
        </div>

        <Section titulo="Cuenta">
          <Item icon={User} label="Mis datos" onClick={() => navigate("/perfil/mis-datos")} />
          <Item icon={Building2} label="Mi empresa" onClick={() => navigate("/perfil/mi-empresa")} />
          <Item icon={ShieldCheck} label="Seguridad" onClick={() => navigate("/perfil/seguridad")} />
          <Item icon={Package} label="Mis productos y servicios" onClick={() => navigate("/perfil/items")} />
          <Item icon={Users} label="Mis clientes" onClick={() => navigate("/perfil/clientes")} />
          <Item icon={UserCog} label="Usuarios del equipo" onClick={() => navigate("/perfil/usuarios")} />
        </Section>

        <Section titulo="Preferencias">
          <Item icon={Bell} label="Notificaciones" onClick={() => navigate("/perfil/notificaciones")} />
          <Item icon={Palette} label="Apariencia" onClick={() => navigate("/perfil/apariencia")} />
        </Section>

        <Section titulo="Más">
          <Item icon={HelpCircle} label="Ayuda y soporte" onClick={() => navigate("/perfil/ayuda")} />
          <Item icon={FileText} label="Términos y condiciones" onClick={() => navigate("/perfil/terminos")} />
          <Item icon={Info} label="Acerca de" onClick={() => navigate("/perfil/acerca-de")} />
        </Section>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-rejected text-sm font-semibold py-3 mb-8"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
