"use client";

import api from "@/lib/axios";

export const getPresupuestoPublicoService = async (id) => {
  const { data } = await api.get(`/presupuestos/public/${id}`);
  return data.presupuesto;
};

export const updateEstadoPublicoService = async (id, estado) => {
  const { data } = await api.patch(
    `/presupuestos/public/${id}/estado`,
    { estado }
  );

  return data.presupuesto;
};