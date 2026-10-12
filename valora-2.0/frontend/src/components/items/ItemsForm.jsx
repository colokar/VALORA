"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/ui/loading/Spinner";
import { createItemsService, updateItemsService } from "@/services/items.service";

export const ItemsForm = ({ isOpen, onClose, onSuccess, tipoInicial = "producto", item = null }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState(tipoInicial);
  const [activo, setActivo] = useState(true);
  const [errorServer, setErrorServer] = useState(null);
  const [loading, setLoading] = useState(false);

  const esEdicion = !!item;

  useEffect(() => {
    if (!isOpen) return;
    setErrorServer(null);

    if (esEdicion) {
      setNombre(item.nombre);
      setPrecio(item.precio);
      setTipo(item.tipo);
      setActivo(item.activo);
    } else {
      setNombre("");
      setPrecio("");
      setTipo(tipoInicial);
      setActivo(true);
    }
  }, [isOpen, tipoInicial, item, esEdicion]);

  const enviar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorServer(null);

      const data = { nombre, precio: Number(precio), tipo, activo };
      const response = esEdicion
        ? await updateItemsService(item.id, data)
        : await createItemsService(data);

      if (onSuccess) onSuccess(response);
      onClose();
    } catch (error) {
      setErrorServer(error.response?.data?.message || "Error guardando item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <form onSubmit={enviar} className="space-y-4 -mt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black mb-2">
            {esEdicion
              ? `Editar ${tipo === "producto" ? "producto" : "servicio"}`
              : "Agregar producto o servicio"}
          </h2>
          <p className="text-gray-500">
            {esEdicion
              ? "Editá la información de un ítem creado"
              : "Completá la información para crear un nuevo ítem."}
          </p>
        </div>

        {!esEdicion && (
          <div className="flex gap-1 mb-5">
            <button
              type="button"
              onClick={() => setTipo("producto")}
              className={`flex-1 h-8 text-sm rounded-xl border transition ${
                tipo === "producto"
                  ? "bg-[#003B6F] text-white border-[#003B6F]"
                  : "bg-white text-[#123B5D] border-gray-300"
              }`}
            >
              Producto
            </button>
            <button
              type="button"
              onClick={() => setTipo("servicio")}
              className={`flex-1 h-8 text-sm rounded-xl border transition ${
                tipo === "servicio"
                  ? "bg-[#003B6F] text-white border-[#003B6F]"
                  : "bg-white text-[#123B5D] border-gray-300"
              }`}
            >
              Servicio
            </button>
          </div>
        )}

        <Input
          label={<span>{tipo === "producto" ? "Producto" : "Servicio"}</span>}
          placeholder="Item a presupuestar"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Input
          label="Precio unitario"
          type="number"
          min="0"
          placeholder="Valor"
          value={precio}
          onChange={(e) => {
            const valor = e.target.value;
            if (Number(valor) >= 0 || valor === "") setPrecio(valor);
          }}
        />

        {esEdicion && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-[#123B5D] font-medium">Estado</span>
            <div className="flex items-center gap-3">
              <span className="text-[#123B5D]">{activo ? "Activo" : "Inactivo"}</span>
              <button
                type="button"
                onClick={() => setActivo(!activo)}
                className={`relative w-12 h-7 rounded-full transition ${
                  activo ? "bg-[#003B6F]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                    activo ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {errorServer && <p className="text-center text-sm text-red-500">{errorServer}</p>}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-[55%] h-10 rounded-full bg-[#528A72] hover:bg-[#43725d] text-white text-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Guardando...
              </>
            ) : (
              <>Guardar {tipo}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};