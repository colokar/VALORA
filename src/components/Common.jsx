import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Loader({ label = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function PageHeader({ title, back = false, action }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2">
        {back && (
          <button onClick={() => navigate(-1)} className="text-gray-500 -ml-1">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-8 text-gray-400 gap-2">
      {Icon && <Icon size={36} className="mb-1 text-gray-300" />}
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}

export function SectionLink({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-xs font-semibold text-primary">
      {children}
    </button>
  );
}
