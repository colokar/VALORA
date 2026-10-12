"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { ItemsForm } from "@/components/items/ItemsForm";
import Loading from "@/components/ui/loading/Loading";
import { BackButton } from "@/components/ui/BackButton";
import { getItemsService } from "@/services/items.service";
import { CircleAlert } from "lucide-react";

export const ItemsPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [items, setItems] = useState([]);
  const [itemEditar, setItemEditar] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("producto");
  const [tipoFormulario, setTipoFormulario] = useState("producto");
  const [busqueda, setBusqueda] = useState("");
  const [loadingItems, setLoadingItems] = useState(true);

  const loadItems = async () => {
    try {
      const data = await getItemsService();
      const lista = data.items || data;
      setItems(lista);
    } catch (error) {
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const itemsActivos = useMemo(() => {
    return items.filter(
      (item) =>
        item.activo &&
        item.tipo === tipoSeleccionado &&
        item.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [items, tipoSeleccionado, busqueda]);

  const itemsInactivos = useMemo(() => {
    return items.filter(
      (item) =>
        !item.activo &&
        item.tipo === tipoSeleccionado &&
        item.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [items, tipoSeleccionado, busqueda]);

  const obtenerIniciales = (nombre = "") =>
    nombre
      .split(" ")
      .slice(0, 2)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase();

  const formatPrecio = (precio) =>
    Number(precio).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const abrirEdicion = (item) => {
    setItemEditar(item);
    setTipoFormulario(item.tipo);
    setOpenForm(true);
  };

  if (loadingItems) {
    return <Loading text="Cargando productos y servicios..." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <BackButton />
        <h1 className="text-2xl font-semibold text-black text-center">
          Mis productos y servicios
        </h1>
        <div className="w-6" />
      </div>

      <div className="grid grid-cols-2 gap-1 mb-5">
        <button
          onClick={() => setTipoSeleccionado("producto")}
          className={`py-3 text-sm font-medium transition rounded-xl border ${
            tipoSeleccionado === "producto"
              ? "bg-[#003B6F] text-white border-[#003B6F]"
              : "bg-white text-[#003B6F] border-gray-300"
          }`}
        >
          Productos
        </button>
        <button
          onClick={() => setTipoSeleccionado("servicio")}
          className={`py-3 text-sm font-medium transition rounded-xl border ${
            tipoSeleccionado === "servicio"
              ? "bg-[#003B6F] text-white border-[#003B6F]"
              : "bg-white text-[#003B6F] border-gray-300"
          }`}
        >
          Servicios
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={`Buscar ${tipoSeleccionado === "producto" ? "productos" : "servicios"}`}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 bg-white outline-none focus:border-[#003B6F]"
          />
        </div>
        <select className="rounded-xl border border-gray-300 px-3 bg-white">
          <option>Todos</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#123B5D]">Activos</h2>
        <button
          onClick={() => {
            setItemEditar(null);
            setTipoFormulario(tipoSeleccionado);
            setOpenForm(true);
          }}
          className="flex items-center gap-1 rounded-full border border-[#003B6F] text-[#003B6F] px-3 py-1.5 text-sm font-semibold hover:bg-[#003B6F] hover:text-white transition"
        >
          <PlusIcon className="w-5 h-5 stroke-[2.5]" />
          Agregar
        </button>
      </div>

      <div className="space-y-3">
        {itemsActivos.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-[#003B6F] text-white flex items-center justify-center font-semibold">
                {obtenerIniciales(item.nombre)}
              </div>
              <div>
                <p className="font-semibold text-[#123B5D]">{item.nombre}</p>
                <p className="text-[#003B6F] mt-1 font-medium">${formatPrecio(item.precio)}</p>
              </div>
            </div>
            <button onClick={() => abrirEdicion(item)}>
              <EllipsisHorizontalIcon className="w-6 h-6 text-[#003B6F]" />
            </button>
          </div>
        ))}

        {itemsActivos.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No hay {tipoSeleccionado === "producto" ? "productos" : "servicios"} registrados.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-[#123B5D] mb-3">Inactivos</h2>

        <div className="space-y-3 mt-4">
          {itemsInactivos.map((item) => (
            <div
              key={item.id}
              className="bg-[#F5F5F5] rounded-2xl p-4 flex justify-between items-start opacity-70"
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">
                  {obtenerIniciales(item.nombre)}
                </div>
                <div>
                  <p className="font-semibold text-gray-500">{item.nombre}</p>
                  <p className="text-gray-400 mt-1 font-medium">${formatPrecio(item.precio)}</p>
                </div>
              </div>
              <button onClick={() => abrirEdicion(item)}>
                <EllipsisHorizontalIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#EAF1F8] rounded-2xl p-4 text-sm text-[#123B5D] flex items-start gap-2">
          <CircleAlert size={22} strokeWidth={3} className="text-[#123B5D] shrink-0 mt-1" />
          <p className="font-medium">
            Los productos y servicios inactivos no estarán disponibles para nuevos presupuestos.
          </p>
        </div>
      </div>

      <ItemsForm
        isOpen={openForm}
        item={itemEditar}
        tipoInicial={tipoFormulario}
        onClose={() => {
          setOpenForm(false);
          setItemEditar(null);
        }}
        onSuccess={() => {
          setOpenForm(false);
          setItemEditar(null);
          loadItems();
        }}
      />
    </div>
  );
};