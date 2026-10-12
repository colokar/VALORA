"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/Input";
import FiltrarPresupuesto from "./FiltrarPresupuesto";

export default function FiltrosPresupuestos({ onFiltrar, totalRegistros, estadoInicial = "" }) {
  const router = useRouter();       
  const pathname = usePathname();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("reciente");

  // Estado para almacenar los filtros activos y mostrarlos en pantalla
  const [filtrosActivos, setFiltrosActivos] = useState({
    estado: estadoInicial,
    periodoSeleccionado: "",
    montoMin: "",
    montoMax: "",
    fechaInicio: "",
    fechaFin: "",
  });

  useEffect(() => {
    if (estadoInicial) {
      const nuevosFiltros = {
        ...filtrosActivos,
        estado: estadoInicial,
      };
      setFiltrosActivos(nuevosFiltros);
      onFiltrar({ busqueda, ...nuevosFiltros, orden: ordenSeleccionado });
    }
  }, [estadoInicial]);

  const handleSearchChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    onFiltrar({ busqueda: valor, ...filtrosActivos, orden: ordenSeleccionado });
  };

  const handleOrdenChange = (e) => {
    const orden = e.target.value;
    setOrdenSeleccionado(orden);
    onFiltrar({ busqueda, ...filtrosActivos, orden });
  };

  const handleAplicarFiltros = (nuevosFiltros) => {
    setFiltrosActivos(nuevosFiltros);
    onFiltrar({ busqueda, ...nuevosFiltros, orden: ordenSeleccionado });
  };

  const handleBorrarTodos = () => {
    const resetFiltros = {
      estado: "",
      periodoSeleccionado: "",
      montoMin: "",
      montoMax: "",
      fechaInicio: "",
      fechaFin: "",
    };
    setFiltrosActivos(resetFiltros);
    setBusqueda("");
    setOrdenSeleccionado("reciente");
    router.replace(pathname, { scroll: false });
    onFiltrar({ busqueda: "", ...resetFiltros, orden: "reciente" });
  };

  const eliminarFiltroIndividual = (key) => {
    const actualizados = { ...filtrosActivos, [key]: "" };
    if (key === "periodoSeleccionado") {
      actualizados.fechaInicio = "";
      actualizados.fechaFin = "";
    }
    setFiltrosActivos(actualizados);
    onFiltrar({ busqueda, ...actualizados, orden: ordenSeleccionado });
  };

  return (
    <div className="space-y-3 mb-4">
      {/* Barra de búsqueda y botón de filtros avanzados */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar presupuesto / cliente..."
            value={busqueda}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors relative"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      </div>

      {/* BADGES / ETIQUETAS DE FILTROS ACTIVOS */}
      {(filtrosActivos.estado ||
        filtrosActivos.periodoSeleccionado ||
        filtrosActivos.montoMin ||
        filtrosActivos.montoMax) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-500 font-medium">
            Filtros activos:
          </span>

          {/* Badge de Estado */}
          {filtrosActivos.estado && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#013364] text-white text-xs font-semibold rounded-full shadow-sm transition-all">
              <span>Estado: {filtrosActivos.estado}</span>
              <button
                onClick={() => eliminarFiltroIndividual("estado")}
                className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold transition-colors"
              >
                ✕
              </button>
            </span>
          )}

          {/* Badge de Periodo */}
          {filtrosActivos.periodoSeleccionado && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#013364] text-white text-xs font-semibold rounded-full shadow-sm transition-all">
              <span>Periodo: {filtrosActivos.periodoSeleccionado}</span>
              <button
                onClick={() => eliminarFiltroIndividual("periodoSeleccionado")}
                className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold transition-colors"
              >
                ✕
              </button>
            </span>
          )}

          {/* Badge de Monto */}
          {(filtrosActivos.montoMin || filtrosActivos.montoMax) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#013364] text-white text-xs font-semibold rounded-full shadow-sm transition-all">
              <span>
                Monto: ${filtrosActivos.montoMin || "0"} - $
                {filtrosActivos.montoMax || "∞"}
              </span>
              <button
                onClick={() => {
                  eliminarFiltroIndividual("montoMin");
                  eliminarFiltroIndividual("montoMax");
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold transition-colors"
              >
                ✕
              </button>
            </span>
          )}

          {/* Botón Limpiar Todo */}
          <button
            onClick={handleBorrarTodos}
            className="text-xs text-red-600 hover:text-red-700 hover:underline ml-2 font-medium transition-colors"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Sección de total de registros y selector de orden */}
      <div className="flex items-center justify-between px-1 w-full">
        <div>
          <p className="text-sm font-semibold text-[#013364]">
            {totalRegistros}{" "}
            {totalRegistros === 1 ? "presupuesto" : "presupuestos"}
          </p>
        </div>

        <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-[#013364]/40 rounded-2xl px-3.5 py-2 shadow-sm transition-all group">
          {/* Icono izquierdo con un fondo sutil */}
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[#013364]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </div>

          {/* Etiqueta Ordenar */}
          <span className="text-[13px] font-normal text-[#013364]">
            Ordenar:
          </span>

          {/* Select nativo optimizado con los estilos solicitados */}
          <select
            value={ordenSeleccionado}
            onChange={handleOrdenChange}
            className="bg-transparent text-[13px] font-bold leading-[20px] text-[#013364] focus:outline-none cursor-pointer appearance-none pr-7 pl-1 w-full"
          >
            <option value="reciente" className="py-2 text-gray-800 font-normal">
              Más recientes
            </option>
            <option value="antiguo" className="py-2 text-gray-800 font-normal">
              Más antiguos
            </option>
            <option
              value="monto_alto"
              className="py-2 text-gray-800 font-normal"
            >
              Mayor monto
            </option>
            <option
              value="monto_bajo"
              className="py-2 text-gray-800 font-normal"
            >
              Menor monto
            </option>
          </select>

          {/* Flechita indicadora moderna */}
          <div className="pointer-events-none absolute right-3 flex items-center text-[#013364]">
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal de Filtros Avanzados */}
      {isModalOpen && (
        <FiltrarPresupuesto
          onClose={() => setIsModalOpen(false)}
          onAplicar={handleAplicarFiltros}
          filtrosIniciales={filtrosActivos}
        />
      )}
    </div>
  );
}
