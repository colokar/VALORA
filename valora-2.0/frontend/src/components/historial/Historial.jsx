"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ButtonListadoCalendario from "./components/ButtonListadoCalendario";
import FiltrosPresupuestos from "./components/FiltrosPresupuestos";
import CalendarioPresupuestos from "./components/CalendarioPresupuesto";
import ClientesConPresupuesto from "../ui/ClientesConPresupuesto";
import VerMasClientes from "@/components/ui/VerMasClientes";
import Spinner from "@/components/ui/loading/Spinner";
import Loading from "@/components/ui/loading/Loading";
import { useFiltroPresupuestos } from "./hooks/useFiltroPresupuesto";

export default function Historial() {
  const searchParams = useSearchParams();

  const [vistaActiva, setVistaActiva] = useState("listado");

  // 💡 Memorizamos el estado inicial de la URL para que no cambie en cada render
  const estadoInicialFiltrado = useMemo(() => {
    const estadoUrlParam = searchParams.get("estado");
    return estadoUrlParam === "Borradores" ? "Borrador" : estadoUrlParam || "";
  }, [searchParams]);

  const {
    presupuestos,
    totalPaginas,
    totalRegistros,
    paginaActual,
    loading,
    error,
    cambiarPagina,
    actualizarFiltros,
    limpiarFiltros,
  } = useFiltroPresupuestos(5, estadoInicialFiltrado);

  // Función para manejar el cambio de vista y limpiar/ajustar filtros si es necesario
  const cambiarVista = (nuevaVista) => {
    setVistaActiva(nuevaVista);
    limpiarFiltros(); // Opcional: limpia los filtros al cambiar de pestaña
  };
  

  return (
    <div>
      <h1 className="text-[24px] font-bold leading-[32px] text-[#0B1001]  mb-4">
        Historial
      </h1>
      {/* Componente para alternar entre Listado y Calendario */}
      <ButtonListadoCalendario
        vistaActiva={vistaActiva}
        onCambiarVista={cambiarVista}
      />

      {/* Renderizado condicional según la pestaña elegida */}
      {vistaActiva === "listado" ? (
        <>
          <FiltrosPresupuestos
            onFiltrar={actualizarFiltros}
            totalRegistros={totalRegistros}
            estadoInicial={estadoInicialFiltrado}
          />

          
            <ClientesConPresupuesto
              presupuestos={presupuestos}
              loading={loading}
              totalRegistros={totalRegistros}
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={cambiarPagina}
              esVistaCompleta={false}
            />
          
        </>
      ) : (
        /* Vista de Calendario: al hacer clic en un día, llama a actualizarFiltros con las fechas */
        <CalendarioPresupuestos
          presupuestos={presupuestos}
          loading={loading}
          onSeleccionarFecha={(fechaSeleccionada) => {
            actualizarFiltros({
              fechaInicio: fechaSeleccionada,
              fechaFin: fechaSeleccionada,
            });
          }}
          totalRegistros={totalRegistros}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={cambiarPagina}
        />
      )}
    </div>
  );
}
