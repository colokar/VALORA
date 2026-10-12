"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";

import { ClientesForm } from "@/components/clientes/ClientesForm";
import Loading from "../ui/loading/Loading";
import { BackButton } from "../ui/BackButton";
import { Input } from "../ui/Input";
import { useClientesFiltro } from "./hooks/useClientesFiltro"; // Ajusta la ruta de tu hook si es necesario

export const ClientesPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [ordenInput, setOrdenInput] = useState("");

  const { clientes, loading, error, actualizarFiltros, limpiarFiltros } =
    useClientesFiltro(10);

  // Manejo de búsqueda en tiempo real
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    setBusquedaInput(valor);
    actualizarFiltros({ busqueda: valor });
  };

  if (loading && clientes.length === 0) {
    return <Loading text="Cargando clientes..." />;
  }

  // Separamos o filtramos activos e inactivos según venga de tu base de datos
  // (Asumiendo que tienen un campo `deleted_at` o `activo`)
  const activos = clientes.filter((c) => !c.deleted_at);
  const inactivos = clientes.filter((c) => c.deleted_at);

  return (
    <div>
      {/* Header */}
      <div className=" pt-6 pb-2 flex items-center justify-between">
        <BackButton />
        <h1 className="text-2xl font-bold text-stone-950">Mis clientes</h1>
        <div className="w-6" /> {/* Espaciador simétrico */}
      </div>

      {/* Barra de Búsqueda y Filtro "Todos" */}
      <div className=" py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400" />
          </span>
          <Input
            type="text"
            value={busquedaInput}
            onChange={handleBusquedaChange}
            placeholder="Buscar clientes"
            /* Sobrescribimos el padding izquierdo para que no se superponga con la lupa */
            className="pl-10 text-xs bg-white"
          />
        </div>

        <div className="relative">
          <select
            value={ordenInput}
            onChange={(e) => {
              const nuevoOrden = e.target.value;
              setOrdenInput(nuevoOrden);
              actualizarFiltros({ orden: nuevoOrden });
            }}
            className="appearance-none flex items-center justify-between px-3 py-3 pr-8 bg-white border border-stone-300 rounded-[10px] text-xs text-black/60 min-w-[110px] focus:outline-none focus:ring-1 focus:ring-[#123B5D] cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="reciente">Reciente</option>
            <option value="antiguo">Antiguo</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-black/60 pointer-events-none">
            &#9660;
          </span>
        </div>
      </div>

      {/* Sección Activos e Botón Agregar */}
      <div className=" pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-950">Activos</h2>
        <button
          onClick={() => {
            setClienteEditar(null);
            setOpenForm(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-black/20 rounded-[10px] text-xs font-medium text-stone-950 transition-colors duration-200 hover:bg-green-500/15"
        >
          <PlusIcon className="w-3.5 h-3.5 text-stone-950" />
          Agregar
        </button>
      </div>

      {/* Lista de Activos */}
      <div className=" space-y-3">
        {activos.map((cliente) => {
          const iniciales =
            `${cliente.nombre?.charAt(0) || ""}${cliente.apellido?.charAt(0) || ""}`.toUpperCase();
          return (
            <div
              key={cliente.id}
              onClick={() => {
                setClienteEditar(cliente);
                setOpenForm(true);
              }}
              className="bg-white rounded-[10px] p-4 shadow-[0px_2px_8px_0px_rgba(0,31,77,0.06)] flex items-center justify-between cursor-pointer hover:border-[#123B5D] transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#003B6F] text-white flex items-center justify-center text-sm font-semibold">
                  {iniciales || "CL"}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-950">
                    {cliente.nombre} {cliente.apellido}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#013364]" />
                    {cliente.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <DevicePhoneMobileIcon className="w-3.5 h-3.5 text-[#013364]" />
                    {cliente.telefono || "11-4567-8910"}
                  </p>
                </div>
              </div>

              <button className="text-black/40 hover:text-black">
                <EllipsisHorizontalIcon className="w-6 h-6" />
              </button>
            </div>
          );
        })}

        {activos.length === 0 && !loading && (
          <p className="text-center text-gray-400 text-xs py-4">
            No hay clientes activos.
          </p>
        )}
      </div>

      {/* Sección Inactivos */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-black/40">Inactivos</h2>
      </div>

      {/* Lista de Inactivos */}
      <div className="px-6 space-y-3">
        {inactivos.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-white rounded-[10px] p-4 shadow-[0px_2px_8px_0px_rgba(0,31,77,0.06)] flex items-center justify-between opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-zinc-300 text-white flex items-center justify-center text-sm font-semibold">
                {cliente.nombre?.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-300">
                  {cliente.nombre} {cliente.apellido}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                  {cliente.email}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                  {cliente.telefono || "11-4567-8910"}
                </p>
              </div>
            </div>
            <EllipsisHorizontalIcon className="w-6 h-6 text-zinc-300" />
          </div>
        ))}

        {inactivos.length === 0 && (
          <p className="text-center text-gray-300 text-xs py-2">
            No hay clientes inactivos.
          </p>
        )}
      </div>

      {/* Formulario Modal (Crear / Editar) */}
      <ClientesForm
        isOpen={openForm}
        clienteId={clienteEditar?.id || null}
        onClose={() => {
          setOpenForm(false);
          setClienteEditar(null);
        }}
        onSuccess={() => {
          setOpenForm(false);
          setClienteEditar(null);
          window.location.reload(); // O puedes re-llamar a tu método de carga si lo expones en el hook
        }}
      />
    </div>
  );
};
