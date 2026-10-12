"use client";

import api from "@/lib/axios";

export const createPresupuestoService = async (credentials) => {
  const { data } = await api.post("/presupuestos", credentials);
  return data;
};


export const getPresupuestosService = async () => {
  const { data } = await api.get("/presupuestos");
  return data;
};

export const getDetallePresupuestosService = async (presupuestosId) => {
  const { data } = await api.get(`/presupuestos/${presupuestosId}`);
  return data;
};

export const updatePresupuestoPdfService = async (presupuestosId, presupuestoData) => {
  const { data } = await api.put(
    `/presupuestos/${presupuestosId}`,
    presupuestoData
  );

  return data;
};

export const updatePresupuestoEstadoService = async (estado, presupuestoId) =>{
  const { data } = await api.patch(
    `/presupuestos/${presupuestoId}`,
    { estado } 
  )
}


export const getPresupuestosByIdService = async (presupuestosId) => {
  const { data } = await api.get(`/presupuestos/${presupuestosId}`);
  return data;
};

export const getPresupuestosDashboardService = async (periodo = 'semanal') => {
  const { data } = await api.get(`/presupuestos/dashboard`,{
    params: { periodo }
  });
  return data;
};

export const getPresupuestosListaService = async (pagina = 1, limite = 5) => {
  const { data } = await api.get(`/presupuestos/lista`,{
    params: { pagina, limite }
  });
  return data;
};

export const getPresupuestosFiltroService = async (params = {}) => {
  const { data } = await api.get(`/presupuestos`, {
    params
  });
  return data;
};


export const downloadPresupuestoService = async (presupuestoId) => {
  const response = await api.get(
    `/presupuestos/${presupuestoId}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};
