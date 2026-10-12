"use client";
import React, { useState } from "react";
import Loading from "@/components/ui/loading/Loading";
import Spinner from "@/components/ui/loading/Spinner";
import { DateAndImg } from "./components/DateAndImg";
import { TotalActivo } from "./components/TotalActivo";
import { ActividadSemanal } from "./components/ActividadSemanal";
import ClienteConPresupuesto from "@/components/ui/ClientesConPresupuesto";
import { useDashboard } from "./hooks/useDashboard";
import { useFiltroPresupuestos } from "@/components/historial/hooks/useFiltroPresupuesto";


export default function Dashboard() {
  const { data, loading, error, periodo, cambiarPeriodo } = useDashboard();

  

  const {
    presupuestos,
    totalPaginas,
    totalRegistros,
    paginaActual,
    loading: loadingPresupuestos,
    error: errorPresupuestos,
    cambiarPagina,
  } = useFiltroPresupuestos(5);

  if (loading && !data) {
    return <Loading text="Cargando inicio..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full px-4 text-center">
        <span className="text-sm text-red-500 font-medium">{error}</span>
      </div>
    );
  }

  const estadisticas = data?.estadisticas || {};
  const actividadSemanal = data?.actividadSemanal || [];

  return (
    <>
      {/* Quitamos max-w-xl/md y usamos w-full con un padding lateral fluido (px-4 o px-5) */}

      <div >
       
          <DateAndImg
            nombre={estadisticas.usuarioNombre}
            apellido={estadisticas.usuarioApellido}
          />

          <TotalActivo
            sumaTotal={estadisticas.sumaTotalMes}
            sumaTotalMesAnterior={estadisticas.sumaTotalMesAnterior}
            totalPresupuestos={estadisticas.presupuestosMes}
            aceptados={estadisticas.aceptadosMes}
            rechazados={estadisticas.rechazadosMes}
          />

          <ActividadSemanal
            actividadSemanal={actividadSemanal}
            periodo={periodo}
            cambiarPeriodo={cambiarPeriodo}
          />

          {loadingPresupuestos && <Spinner />}
          {errorPresupuestos && <p className="text-red-500 text-center mt-4">{errorPresupuestos}</p>}

          <ClienteConPresupuesto
            presupuestos={presupuestos}
            loading={loadingPresupuestos}
            totalRegistros={totalRegistros}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={cambiarPagina}
            esVistaCompleta={false}
          />
   
      </div>
    </>
  );
}
