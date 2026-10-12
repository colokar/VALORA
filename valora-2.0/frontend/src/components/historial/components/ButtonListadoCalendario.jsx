"use client";
export default function ButtonListadoCalendario({
    vistaActiva,
    onCambiarVista,
}) {
  return (  
    <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
        <button
            type="button"
            onClick={() => onCambiarVista("listado")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                vistaActiva === "listado"
                    ? "bg-[#013364] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
            }`}
        >
            Listado
        </button>

        <button
            type="button"
            onClick={() => onCambiarVista("calendario")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                vistaActiva === "calendario"
                    ? "bg-[#013364] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
            }`}
        >
            Calendario
        </button>
    </div>
  );
}