import { PageHeader } from "../../components/Common";

export default function About() {
  return (
    <div className="app-shell">
      <PageHeader title="Acerca de" back />
      <div className="page-content px-5 flex flex-col items-center text-center pt-6">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-extrabold mb-4">V</div>
        <h2 className="text-lg font-extrabold text-gray-900">Valora</h2>
        <p className="text-xs text-gray-400 mt-1">Versión 1.0.0 (MVP)</p>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          Valora ayuda a emprendedores a generar, enviar y hacer seguimiento de presupuestos de
          forma simple, desde el celular.
        </p>
      </div>
    </div>
  );
}
