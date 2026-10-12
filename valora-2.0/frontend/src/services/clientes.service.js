"use client";

import api from "@/lib/axios";


export const createClienteService = async (credentials) => {
  const { data } = await api.post("/clientes", credentials);
  return data;
};


export const getClientesService = async () => {
  const { data } = await api.get("/clientes");
  return data;
};


export const getClienteByIdService = async (clienteId) => {
  const { data } = await api.get(`/clientes/${clienteId}`);
  return data;
};


export const updateClienteService = async (clienteId, clienteData) => {
  const { data } = await api.put(
    `/clientes/update/${clienteId}`,
    clienteData
  );

  return data;
};

export const getClientesFiltroService = async (params = {}) => {
  const { data } = await api.get("/clientes/filtro", { 
    params
  });
  return data;
};
