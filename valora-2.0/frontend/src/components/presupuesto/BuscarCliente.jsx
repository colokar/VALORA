"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, UserRoundPlus } from "lucide-react";
import Spinner from "@/components/ui/loading/Spinner";
import { Input } from "@/components/ui/Input";

import { getClientesService } from "@/services/clientes.service";

export const BuscarCliente = ({
  clienteSeleccionado,
  onSelect,
  onNuevoCliente,
}) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const ref = useRef(null);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await getClientesService();
        setClientes(data.clientes || data);
      } catch (error) {
        console.error("Error cargando clientes", error);
      } finally {
        setLoadingClientes(false);
      }
    };

    cargarClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      setBusqueda(
        `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`,
      );
    } else {
      setBusqueda("");
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    const clickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMostrarLista(false);
      }
    };

    document.addEventListener("mousedown", clickFuera);

    return () => document.removeEventListener("mousedown", clickFuera);
  }, []);

  const filtrados = useMemo(() => {
    if (!busqueda) return clientes;

    return clientes.filter((cliente) => {
      const nombre = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
      const email = cliente.email?.toLowerCase() || "";

      return (
        nombre.includes(busqueda.toLowerCase()) ||
        email.includes(busqueda.toLowerCase())
      );
    });
  }, [clientes, busqueda]);

  const seleccionar = (cliente) => {
    setBusqueda(`${cliente.nombre} ${cliente.apellido}`);
    onSelect(cliente);
    setMostrarLista(false);
  };

  const nuevoCliente = () => {
    setMostrarLista(false);

    if (onNuevoCliente) {
      onNuevoCliente();
    }
  };

  return (
    <div ref={ref} className="relative">
      <label className="block mb-2 text-xs font-medium text-[#123B5D]">
        Cliente
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="flex items-center justify-between w-full gap-2">
        <div className="relative w-[320px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            value={busqueda}
            onFocus={() => setMostrarLista(true)}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarLista(true);
            }}
            placeholder="Buscar o crear cliente"
            className="
        h-10
        pl-9
        pr-3
        text-xs
        text-[#123B5D]
        border-gray-300
        focus:border-[#528A72]
        focus:ring-[#528A72]/20
      "
          />
        </div>

        <button
          type="button"
          onClick={nuevoCliente}
          className="
            w-10
            h-10
            rounded-lg
            bg-[#123B5D]
            flex
            items-center
            justify-center
            text-white
            shrink-0
            hover:bg-[#0d2b44]
            transition
          "
        >
          <UserRoundPlus size={19} strokeWidth={2} />
        </button>
      </div>

      {mostrarLista && (
        <div
          className="
            absolute
            z-30
            mt-2
            w-[320px]
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-lg
            max-h-60
            overflow-y-auto
          "
        >
          {loadingClientes ? (
            <div className="p-6 flex flex-col items-center justify-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500 font-medium">
                Cargando clientes...
              </p>
            </div>
          ) : filtrados.length > 0 ? (
            filtrados.map((cliente) => (
              <button
                key={cliente.id}
                type="button"
                onClick={() => seleccionar(cliente)}
                className="w-full px-3 py-3 text-left hover:bg-[#F4F8F6]"
              >
                <p className="text-sm font-medium text-[#123B5D]">
                  {cliente.nombre} {cliente.apellido}
                </p>

                <p className="text-xs text-gray-500">{cliente.email}</p>
              </button>
            ))
          ) : (
            <p className="p-3 text-xs text-gray-500">No hay clientes</p>
          )}
        </div>
      )}
    </div>
  );
};
