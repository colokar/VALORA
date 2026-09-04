import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import BudgetCard from "../components/BudgetCard";
import { Loader, EmptyState, SectionLink } from "../components/Common";
import { formatMonto } from "../utils/format";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";
import ValoraLogo from "../assets/Logo.png";

// Colores compartidos con StatusBadge / index.css para que el significado
// de cada color sea siempre el mismo en toda la app.
const COLOR_APROBADO = "#1a9c5a";
const COLOR_PENDIENTE = "#e6a017";
const COLOR_RECHAZADO = "#d43d3d";

function esDelMes(fechaISO, mesRef) {
  const f = new Date(fechaISO);
  return f.getFullYear() === mesRef.getFullYear() && f.getMonth() === mesRef.getMonth();
}

// Semana de lunes a domingo, con el desglose por estado de cada día.
function getSemanaData(presupuestos) {
  const hoy = new Date();
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const diaSemanaActual = hoy.getDay(); // 0 = domingo ... 6 = sábado
  const offsetDesdeLunes = diaSemanaActual === 0 ? 6 : diaSemanaActual - 1;
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - offsetDesdeLunes);
  inicioSemana.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicioSemana);
    dia.setDate(inicioSemana.getDate() + i);
    const delDia = presupuestos.filter((p) => new Date(p.fechaCreacion).toDateString() === dia.toDateString());
    return {
      name: dias[i],
      aprobados: delDia.filter((p) => p.estado === "aprobado").length,
      pendientes: delDia.filter((p) => p.estado === "pendiente").length,
      rechazados: delDia.filter((p) => p.estado === "rechazado").length,
    };
  });
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

export default function Home() {
  const { usuario } = useAuth();
  const { empresa, presupuestos, cargando } = useData();
  const navigate = useNavigate();

  const resumenMes = useMemo(() => {
    const hoy = new Date();
    const mesAnteriorRef = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);

    const esteMes = presupuestos.filter((p) => esDelMes(p.fechaCreacion, hoy));
    const mesAnterior = presupuestos.filter((p) => esDelMes(p.fechaCreacion, mesAnteriorRef));

    const montoEsteMes = esteMes.filter((p) => p.estado === "aprobado").reduce((acc, p) => acc + p.monto, 0);
    const montoMesAnterior = mesAnterior.filter((p) => p.estado === "aprobado").reduce((acc, p) => acc + p.monto, 0);

    let comparacion = { texto: "Sin actividad el mes anterior", pct: null };
    if (montoMesAnterior > 0) {
      const pct = Math.round(((montoEsteMes - montoMesAnterior) / montoMesAnterior) * 100);
      comparacion = { texto: `${Math.abs(pct)}% vs el mes anterior`, pct };
    } else if (montoEsteMes > 0) {
      comparacion = { texto: "Nuevo este mes", pct: null };
    }

    return {
      montoEsteMes,
      comparacion,
      totalPresupuestos: esteMes.length,
      aceptados: esteMes.filter((p) => p.estado === "aprobado").length,
      rechazados: esteMes.filter((p) => p.estado === "rechazado").length,
    };
  }, [presupuestos]);

  const semanaData = useMemo(() => getSemanaData(presupuestos), [presupuestos]);
  const hayActividadEstaSemana = semanaData.some((d) => d.aprobados || d.pendientes || d.rechazados);
  const recientes = presupuestos.slice(0, 5);
  const primerNombre = usuario?.nombre?.split(" ")[0] || "";

  if (cargando) return <div className="app-shell"><Loader /></div>;

  return (
    <div className="app-shell">
      <div className="page-content px-5 pt-6">
        <h1 className="text-xl font-extrabold text-gray-900 -mt-0.5" > <img src={ValoraLogo} alt="Logo VALORA" width={50} style={{ display: "inline" }} /> {primerNombre} -  {empresa?.nombre}</h1>

        {/* Card resumen del mes */}
        <div className="mt-5 bg-primary rounded-xl2 p-5 text-white relative overflow-hidden">
          <p className="text-xs text-white/70 font-medium">Total activo este mes</p>
          <p className="text-3xl font-extrabold mt-1">{formatMonto(resumenMes.montoEsteMes, empresa?.moneda)}</p>

          <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
            {resumenMes.comparacion.pct !== null && (
              resumenMes.comparacion.pct >= 0
                ? <TrendingUp size={14} className="text-emerald-300" />
                : <TrendingDown size={14} className="text-rose-300" />
            )}
            <span>
              {resumenMes.comparacion.pct !== null && (resumenMes.comparacion.pct >= 0 ? "↑ " : "↓ ")}
              {resumenMes.comparacion.texto}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="bg-white/10 rounded-full px-3 py-1.5 text-[11px] font-medium">
              Presupuestos <b className="font-extrabold">{resumenMes.totalPresupuestos}</b>
            </span>
            <span className="bg-white/10 rounded-full px-3 py-1.5 text-[11px] font-medium">
              Aceptados <b className="font-extrabold">{resumenMes.aceptados}</b>
            </span>
            <span className="bg-white/10 rounded-full px-3 py-1.5 text-[11px] font-medium">
              Rechazados <b className="font-extrabold">{String(resumenMes.rechazados).padStart(2, "0")}</b>
            </span>
          </div>
        </div>

        {/* Actividad semanal */}
        <div className="mt-6 bg-white border border-gray-100 rounded-xl2 p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800">Actividad de la semana</h2>
            <SectionLink onClick={() => navigate("/dashboard")}>Ver más</SectionLink>
          </div>
          <div className="h-32">
            {hayActividadEstaSemana ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={semanaData} barGap={2} barCategoryGap={16}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9aa5b1" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(1,51,100,0.05)" }} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="aprobados" name="Aprobados" fill={COLOR_APROBADO} radius={[4, 4, 0, 0]} maxBarSize={10} />
                  <Bar dataKey="pendientes" name="Pendientes" fill={COLOR_PENDIENTE} radius={[4, 4, 0, 0]} maxBarSize={10} />
                  <Bar dataKey="rechazados" name="Rechazados" fill={COLOR_RECHAZADO} radius={[4, 4, 0, 0]} maxBarSize={10} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-gray-400">Todavía no creaste presupuestos esta semana</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 mt-1">
            <LegendDot color={COLOR_APROBADO} label="Aprobados" />
            <LegendDot color={COLOR_PENDIENTE} label="Pendientes" />
            <LegendDot color={COLOR_RECHAZADO} label="Rechazados" />
          </div>
        </div>

        {/* Últimos 5 presupuestos */}
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800">Presupuestos recientes</h2>
            <SectionLink onClick={() => navigate("/historial")}>Ver más</SectionLink>
          </div>

          {recientes.length === 0 ? (
            <EmptyState icon={FileText} title="Todavía no generaste presupuestos" subtitle="Tocá el botón + para crear el primero" />
          ) : (
            <div className="flex flex-col gap-3">
              {recientes.map((p) => (
                <BudgetCard key={p.id} presupuesto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
