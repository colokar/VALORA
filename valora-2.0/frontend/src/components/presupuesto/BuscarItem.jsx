"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import Spinner from "@/components/ui/loading/Spinner";
import { getItemsService } from "@/services/items.service";

export const BuscarItem = ({ onAgregarItem }) => {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getItemsService();
        setItems(data.items || data);
      } catch (error) {
        console.error(error);
      }finally {
        setLoadingItems(false); 
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setMostrarLista(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemsFiltrados = useMemo(() => {
  return items.filter((item) => {
    return (
      item.activo &&
      item.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  });
}, [items, busqueda]);
  const agregarItem = (item) => {
    onAgregarItem({ ...item, cantidad: 1 });

    setBusqueda("");
    setMostrarLista(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Label + número presupuesto */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-[#123B5D]">
          Nombre del servicio
          <span className="text-red-500 ml-1">*</span>
        </label>
      </div>

      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={busqueda}
          placeholder="Agregar servicio o producto"
          onFocus={() => setMostrarLista(true)}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
          }}
          className="
            w-full
            h-10
            rounded-xl
            border
            border-gray-300
            pl-9
            pr-3
            text-xs
            text-[#123B5D]
            outline-none
            focus:border-[#528A72]
            focus:ring-2
            focus:ring-[#528A72]/20
          "
        />
      </div>

      {/* Lista */}
      {mostrarLista && (
        <div
          className="
            absolute
            z-30
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-lg
            overflow-hidden
            max-h-72
            overflow-y-auto
          "
        >
          {loadingItems ? (
            <div className="p-6 flex flex-col items-center justify-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500 font-medium">Cargando servicios...</p>
            </div>
          ) : itemsFiltrados.length > 0 ? (
            itemsFiltrados.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => agregarItem(item)}
                className="w-full px-4 py-3 text-left hover:bg-[#F4F8F6] transition"
              >
                <p className="text-sm font-medium text-[#123B5D]">
                  {item.nombre}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  ${Number(item.precio).toLocaleString()}
                </p>
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-gray-500">
              No se encontraron productos o servicios.
            </p>
          )}
        </div>
      )}
    </div>
  );
};