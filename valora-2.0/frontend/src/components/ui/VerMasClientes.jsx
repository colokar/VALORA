"use client";

import ClientesConPresupuesto from "@/components/ui/ClientesConPresupuesto";
import { BackButton } from "@/components/ui/BackButton";
import Spinner from "@/components/ui/loading/Spinner";
import Loading from "@/components/ui/loading/Loading";
import { useFiltroPresupuestos } from "@/components/historial/hooks/useFiltroPresupuesto";// Ajusta la ruta de tu hook si es necesario
import Link from "next/link";

export default function TodosLosPresupuestosPage() {
  // Pedimos los datos (aquí puedes pasarle un límite mayor, por ejemplo 10 por página)
  const {
    presupuestos,
    totalPaginas,
    totalRegistros,
    paginaActual,
    loading,
    error,
    cambiarPagina,
  } = useFiltroPresupuestos(10);

  if(loading) {
    <Loading text="Cargando todos los presupuestos..." />
   }

  return (
    <div >
      {/* Cabecera con botón de retroceso hacia el Historial */}
      <div className="sticky top-0 bg-gray-50 z-40 py-4 border-b border-gray-100 mb-4 flex items-center gap-3">
        
          <BackButton />
    
        <h1 className="text-xl font-bold text-[#0B376D]">
          Todos los Presupuestos
        </h1>
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!loading && !error && (
        <ClientesConPresupuesto
          presupuestos={presupuestos}
          loading={loading}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={totalRegistros}
          onCambiarPagina={cambiarPagina}
          esVistaCompleta={true}
        />
      )}
    </div>
  );
}