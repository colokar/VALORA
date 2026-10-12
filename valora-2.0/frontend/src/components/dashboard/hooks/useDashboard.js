"use client";

import { useState, useEffect, useCallback } from "react";
import { getPresupuestosDashboardService } from "@/services/presupuesto.service"; // Ajusta la ruta de importación según tu proyecto
import { getLocalDashboardData } from "@/services/localDataService";
import { isLocalSessionActive } from "@/services/localAuthService";

export function useDashboard() {
  const [periodo, setPeriodo] = useState("semanal");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (selectedPeriodo) => {
    try {
      setLoading(true);
      setError(null);
      if (isLocalSessionActive()) {
        setData(getLocalDashboardData(selectedPeriodo));
        return;
      }
      const response = await getPresupuestosDashboardService(selectedPeriodo);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchDashboard(periodo), 0);
    return () => window.clearTimeout(timer);
  }, [periodo, fetchDashboard]);

  const cambiarPeriodo = (nuevoPeriodo) => {
    setPeriodo(nuevoPeriodo);
  };

  return {
    data,
    loading,
    error,
    periodo,
    cambiarPeriodo,
  };
}