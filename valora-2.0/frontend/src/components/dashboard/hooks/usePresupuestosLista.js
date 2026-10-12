"use client";

import { useState, useEffect, useCallback } from "react";
import { getPresupuestosFiltroService } from "@/services/presupuesto.service"; // Ajusta tu ruta

export function useFiltroPresupuestos(initialLimite = 10) {
  
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(initialLimite);
  const [filtros, setFiltros] = useState({});
  const [resultado, setResultado] = useState({ data: [], totalPaginas: 1, totalRegistros: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPresupuestos = useCallback(async (p, l, f) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPresupuestosFiltroService({
        pagina: p,
        limite: l,
        filtro: JSON.stringify(f)
      });
      setResultado(res); // El backend responde con { success: true, totalRegistros, paginaActual, limite, totalPaginas, data }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los presupuestos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPresupuestos(pagina, limite, filtros);
  }, [pagina, limite, filtros, cargarPresupuestos]);

  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setPagina(1); // Volver a la página 1 cuando se filtra
  };

  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  return {
    presupuestos: resultado.data || [],
    totalPaginas: resultado.totalPaginas || 1,
    totalRegistros: resultado.totalRegistros || 0,
    paginaActual: pagina,
    limite,
    loading,
    error,
    cambiarPagina,
    actualizarFiltros,
  };
}