import { PageHeader } from "../../components/Common";
import { Mail, MessageCircle, BookOpen } from "lucide-react";

export default function Help() {
  return (
    <div className="app-shell">
      <PageHeader title="Ayuda y soporte" back />
      <div className="page-content px-5 flex flex-col gap-3">
        <a href="mailto:soporte@valora.app" className="flex items-center gap-3 border border-gray-100 rounded-xl2 p-4 shadow-card">
          <Mail size={18} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-700">Escribinos por email</p>
            <p className="text-xs text-gray-400">soporte@valora.app</p>
          </div>
        </a>
        <div className="flex items-center gap-3 border border-gray-100 rounded-xl2 p-4 shadow-card">
          <MessageCircle size={18} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-700">Chat en vivo</p>
            <p className="text-xs text-gray-400">Disponible de lunes a viernes, 9 a 18 hs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border border-gray-100 rounded-xl2 p-4 shadow-card">
          <BookOpen size={18} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-700">Centro de ayuda</p>
            <p className="text-xs text-gray-400">Guías y preguntas frecuentes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
