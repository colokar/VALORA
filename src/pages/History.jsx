import { useState, useMemo } from "react";
import { List, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useData } from "../context/DataContext";
import BudgetCard from "../components/BudgetCard";
import FilterModal from "../components/FilterModal";
import { Loader, EmptyState } from "../components/Common";

const DIAS_SEMANA = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const FILTROS_VACIOS = { estados: [], rango: null, desde: "", hasta: "", montoDesde: "", montoHasta: "" };

const ORDEN_OPCIONES = [
  { key: "recientes", label: "Más recientes" },
  { key: "antiguos", label: "Más antiguos" },
  { key: "mayor", label: "Mayor monto" },
  { key: "menor", label: "Menor monto" },
];

export default function History() {
  const { presupuestos, cargando } = useData();
  const [vista, setVista] = useState("lista");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [ordenAbierto, setOrdenAbierto] = useState(false);
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const filtrosActivos = filtros.estados.length > 0 || filtros.rango || filtros.montoDesde || filtros.montoHasta;

  const presupuestosFiltrados = useMemo(() => {
    let lista = [...presupuestos];

    if (busqueda) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) => p.cliente?.nombre?.toLowerCase().includes(q) || p.numero.toLowerCase().includes(q)
      );
    }

    if (filtros.estados.length > 0) {
      lista = lista.filter((p) => filtros.estados.includes(p.estado));
    }

    if (filtros.montoDesde) lista = lista.filter((p) => p.monto >= Number(filtros.montoDesde));
    if (filtros.montoHasta) lista = lista.filter((p) => p.monto <= Number(filtros.montoHasta));

    if (filtros.rango) {
      const hoy = new Date();
      lista = lista.filter((p) => {
        const f = new Date(p.fechaCreacion);
        if (filtros.rango === "hoy") return f.toDateString() === hoy.toDateString();
        if (filtros.rango === "semana") return (hoy - f) / 86400000 <= 7;
        if (filtros.rango === "mes") return (hoy - f) / 86400000 <= 30;
        if (filtros.rango === "personalizado") {
          const desde = filtros.desde ? new Date(filtros.desde) : null;
          const hasta = filtros.hasta ? new Date(filtros.hasta) : null;
          return (!desde || f >= desde) && (!hasta || f <= hasta);
        }
        return true;
      });
    }

    lista.sort((a, b) => {
      if (orden === "recientes") return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      if (orden === "antiguos") return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
      if (orden === "mayor") return b.monto - a.monto;
      if (orden === "menor") return a.monto - b.monto;
      return 0;
    });

    return lista;
  }, [presupuestos, busqueda, filtros, orden]);

  const diasConPresupuesto = useMemo(() => {
    const set = new Set();
    presupuestos.forEach((p) => {
      const f = new Date(p.fechaCreacion);
      if (f.getMonth() === mesActual.getMonth() && f.getFullYear() === mesActual.getFullYear()) set.add(f.getDate());
    });
    return set;
  }, [presupuestos, mesActual]);

  const presupuestosDelDia = useMemo(() => {
    if (!diaSeleccionado) return [];
    return presupuestos.filter((p) => {
      const f = new Date(p.fechaCreacion);
      return f.getDate() === diaSeleccionado && f.getMonth() === mesActual.getMonth() && f.getFullYear() === mesActual.getFullYear();
    });
  }, [presupuestos, diaSeleccionado, mesActual]);

  const celdas = useMemo(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    let primerDia = new Date(year, month, 1).getDay();
    primerDia = primerDia === 0 ? 6 : primerDia - 1; // semana arranca en lunes
    const totalDias = new Date(year, month + 1, 0).getDate();
    const arr = Array(primerDia).fill(null);
    for (let d = 1; d <= totalDias; d++) arr.push(d);
    return arr;
  }, [mesActual]);

  function cambiarMes(delta) {
    const nuevo = new Date(mesActual);
    nuevo.setMonth(nuevo.getMonth() + delta);
    setMesActual(nuevo);
    setDiaSeleccionado(null);
  }

  const hoy = new Date();
  const ordenLabel = ORDEN_OPCIONES.find((o) => o.key === orden)?.label;

  if (cargando) return <div className="app-shell"><Loader /></div>;

  return (
    <div className="app-shell">
      <div className="page-content px-4 pt-6">
        <h1 className="vx-page-title mb-5 px-1">Historial</h1>

        {/* Buscador + filtro */}
        <div className="flex items-center gap-2 mb-4">
          <div className="vx-input-row flex-1 text-gray-400">
            <Search size={16} className="shrink-0" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar presupuesto / cliente..."
              className="w-full text-sm focus:outline-none bg-transparent text-gray-700"
            />
          </div>
          <button
            onClick={() => setFiltroAbierto(true)}
            className={`relative w-11 h-11 rounded-[10px] border flex items-center justify-center shrink-0 ${
              filtrosActivos ? "border-primary bg-primary/5 text-primary" : "border-gray-300 text-gray-400"
            }`}
          >
            <SlidersHorizontal size={18} />
            {filtrosActivos && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        </div>

        {/* Toggle lista/calendario */}
        <div className="flex gap-2.5 mb-4">
          <button
            onClick={() => setVista("lista")}
            className={`vx-tab-pill flex-1 flex items-center justify-center gap-1.5 ${vista === "lista" ? "vx-tab-pill-active" : "vx-tab-pill-inactive"}`}
          >
            {/* <List size={16} /> */}Listado 
          </button>
          <button
            onClick={() => setVista("calendario")}
            className={`vx-tab-pill flex-1 flex items-center justify-center gap-1.5 ${vista === "calendario" ? "vx-tab-pill-active" : "vx-tab-pill-inactive"}`}
          >
            {/* <CalendarIcon size={16} />*/} Calendario 
          </button>
        </div>

        {vista === "lista" && (
          <>
            <div className="relative flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-gray-500">{presupuestosFiltrados.length} presupuestos</span>
              <button
                onClick={() => setOrdenAbierto((v) => !v)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-[10px] px-3 py-1.5 text-xs"
              >
                <span className="text-gray-400">Ordenar:</span>
                <span className="font-semibold text-primary">{ordenLabel}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
              {ordenAbierto && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-card border border-gray-100 z-20 overflow-hidden w-44">
                  {ORDEN_OPCIONES.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => { setOrden(o.key); setOrdenAbierto(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs ${orden === o.key ? "text-primary font-semibold bg-primary/5" : "text-gray-500"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {presupuestosFiltrados.length === 0 ? (
                <EmptyState title="No encontramos presupuestos" subtitle="Probá con otra búsqueda o quitá los filtros" />
              ) : (
                presupuestosFiltrados.map((p) => <BudgetCard key={p.id} presupuesto={p} />)
              )}
            </div>
          </>
        )}

        {vista === "calendario" && (
          <div className="mb-8 vx-card-flat p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => cambiarMes(-1)} className="p-1.5 text-gray-400"><ChevronLeft size={20} /></button>
              <h3 className="text-sm font-semibold text-gray-700">{MESES[mesActual.getMonth()]} {mesActual.getFullYear()}</h3>
              <button onClick={() => cambiarMes(1)} className="p-1.5 text-gray-400"><ChevronRight size={20} /></button>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
              {DIAS_SEMANA.map((d, i) => (
                <span key={i} className="text-[11px] font-semibold text-gray-300">{d}</span>
              ))}
              {celdas.map((dia, i) => {
                const esHoy = dia && dia === hoy.getDate() && mesActual.getMonth() === hoy.getMonth() && mesActual.getFullYear() === hoy.getFullYear();
                const tienePresupuesto = dia && diasConPresupuesto.has(dia);
                const seleccionado = dia && dia === diaSeleccionado;
                return (
                  <button key={i} disabled={!dia} onClick={() => setDiaSeleccionado(dia)} className="flex flex-col items-center justify-center h-11">
                    {dia && (
                      <>
                        <span
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                            seleccionado ? "bg-primary text-white" : esHoy ? "border border-primary text-primary" : "text-gray-600"
                          }`}
                        >
                          {dia}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${tienePresupuesto ? "bg-accent" : "bg-transparent"}`} />
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-primary mb-0.5">
                {diaSeleccionado
                  ? `${diaSeleccionado < 10 ? "0" + diaSeleccionado : diaSeleccionado} de ${MESES[mesActual.getMonth()]}`
                  : "Seleccioná un día"}
              </h4>
              {diaSeleccionado && (
                <p className="text-xs text-primary/70 mb-3">{presupuestosDelDia.length} presupuestos</p>
              )}
              <div className="flex flex-col gap-3">
                {diaSeleccionado && presupuestosDelDia.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">Sin presupuestos ese día.</p>
                )}
                {presupuestosDelDia.map((p) => <BudgetCard key={p.id} presupuesto={p} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      <FilterModal
        open={filtroAbierto}
        onClose={() => setFiltroAbierto(false)}
        filtros={filtros}
        onAplicar={setFiltros}
      />
    </div>
  );
}
