import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useData } from "../context/DataContext";
import { Loader } from "../components/Common";
import { formatMonto, formatFecha } from "../utils/format";
import { ChevronLeft, ChevronRight, FileClock } from "lucide-react";

const COLORES_ESTADO = { aprobado: "#013364", pendiente: "#4d7093", rechazado: "#b3c2d0" };
const ESTADO_LABEL = { aprobado: "Aprobados", pendiente: "Pendientes", rechazado: "Rechazados" };

export default function Dashboard() {
  const navigate = useNavigate();
  const { presupuestos, clientes, empresa, cargando } = useData();

  const porEstado = useMemo(() => {
    const conteo = { aprobado: 0, pendiente: 0, rechazado: 0 };
    presupuestos.forEach((p) => { if (conteo[p.estado] !== undefined) conteo[p.estado]++; });
    const relevantes = conteo.aprobado + conteo.pendiente + conteo.rechazado;
    return Object.entries(conteo).map(([estado, value]) => ({
      estado,
      value,
      pct: relevantes ? Math.round((value / relevantes) * 100) : 0,
    }));
  }, [presupuestos]);

  const totalPresupuestos = presupuestos.length;
  const borradores = presupuestos.filter((p) => p.estado === "borrador").length;

  const historialMensual = useMemo(() => {
    const meses = {};
    presupuestos.forEach((p) => {
      const d = new Date(p.fechaCreacion);
      const key = d.toLocaleDateString("es-AR", { month: "short" });
      meses[key] = (meses[key] || 0) + p.monto / 1000;
    });
    return Object.entries(meses)
      .map(([mes, monto]) => ({ mes, monto: Math.round(monto) }))
      .reverse();
  }, [presupuestos]);

  const ultimosClientes = useMemo(() => {
    const vistos = new Set();
    const resultado = [];
    for (const p of presupuestos) {
      if (!p.clienteId || vistos.has(p.clienteId)) continue;
      vistos.add(p.clienteId);
      resultado.push(p.cliente);
      if (resultado.length === 3) break;
    }
    return resultado.filter(Boolean);
  }, [presupuestos]);

  if (cargando) return <div className="app-shell"><Loader /></div>;

  return (
    <div className="app-shell">
      <div className="page-content px-5 pt-6">
        <div className="flex items-center justify-center relative mb-6">
          <button onClick={() => navigate(-1)} className="absolute left-0 text-gray-800"><ChevronLeft size={24} /></button>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        </div>

        {/* Estado de presupuestos */}
        <h2 className="vx-section-title mb-3">Estado de presupuestos</h2>
        <div className="vx-card-flat p-5 mb-6 flex items-center gap-5">
          <div className="w-[110px] h-[110px] relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porEstado} dataKey="value" nameKey="estado" innerRadius={34} outerRadius={54} paddingAngle={2} startAngle={90} endAngle={-270}>
                  {porEstado.map((e) => <Cell key={e.estado} fill={COLORES_ESTADO[e.estado]} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{totalPresupuestos}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            {porEstado.map((e) => (
              <div key={e.estado} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-primary">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: COLORES_ESTADO[e.estado] }} />
                  {ESTADO_LABEL[e.estado]}
                </span>
                <span className="font-semibold text-primary">{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de presupuestos */}
        <h2 className="vx-section-title mb-3">Historial de presupuestos</h2>
        <div className="vx-card-flat p-5 mb-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historialMensual} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eef1f5" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9aa5b1" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9aa5b1" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `${v}k`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="monto" stroke="#4d7093" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos clientes */}
        <h2 className="vx-section-title mb-3">Últimos clientes</h2>
        <div className="vx-card-flat p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {ultimosClientes.length === 0 && <p className="text-xs text-gray-400">Sin clientes recientes</p>}
            {ultimosClientes.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-1.5 w-16">
                <span className="w-[52px] h-[52px] rounded-full bg-[#4d7093] flex items-center justify-center">
                  <span className="vx-avatar w-8 h-8 text-xs">{c.nombre.slice(0, 2).toUpperCase()}</span>
                </span>
                <span className="text-[11px] text-primary text-center leading-tight">{c.nombre}</span>
              </div>
            ))}
          </div>
          {ultimosClientes.length > 0 && (
            <button onClick={() => navigate("/perfil/clientes")} className="text-gray-300">
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Borradores */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="vx-section-title">Borradores</h2>
          <button onClick={() => navigate("/historial")} className="text-xs font-extrabold text-accent">Ver más</button>
        </div>
        <div className="vx-card-flat p-4 flex items-center gap-4 mb-8">
          <span className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <FileClock size={22} className="text-gray-400" />
          </span>
          <div>
            <p className="text-lg font-bold text-primary">{borradores.toString().padStart(2, "0")}</p>
            <p className="text-sm font-medium text-primary/80">Presupuestos en borrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
