"use client";

import api from "@/lib/axios";


export const createPresupuestoService = async (presupuestoData) => {

  const { data } = await api.post(
    "/presupuestos",
    presupuestoData
  );

  return data;

};


export const updatePresupuestoService = async (
  presupuestoId,
  presupuestoData
) => {

  const { data } = await api.put(
    `/presupuestos/${presupuestoId}`,
    presupuestoData
  );

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