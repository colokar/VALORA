import { PageHeader } from "../../components/Common";

export default function Terms() {
  return (
    <div className="app-shell">
      <PageHeader title="Términos y condiciones" back />
      <div className="page-content px-5 text-sm text-gray-500 leading-relaxed">
        <p className="mb-3">
          Este es un texto de ejemplo para el MVP. Acá va el contenido legal completo de
          Términos y Condiciones de uso de Valora antes de salir a producción.
        </p>
        <p className="mb-3">
          Al usar Valora aceptás que la información cargada (clientes, presupuestos, productos y
          servicios) es de tu responsabilidad y se utiliza únicamente para el funcionamiento de la
          herramienta.
        </p>
        <p>Última actualización: julio de 2026.</p>
      </div>
    </div>
  );
}
