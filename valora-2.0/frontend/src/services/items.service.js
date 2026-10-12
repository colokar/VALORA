"use client";

import api from "@/lib/axios";


export const createItemsService = async (credentials) => {
  const { data } = await api.post("/items", credentials);
  return data;
};


export const getItemsService = async () => {
  const { data } = await api.get("/items");
  return data;
};


export const getItemByIdService = async (itemId) => {
  const { data } = await api.get(`/items/${itemId}`);
  return data;
};


export const updateItemsService = async (itemId, itemData) => {
  const { data } = await api.put(
    `/items/${itemId}`,
    itemData
  );

  return data;
};