"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BackButton } from "@/components/ui/BackButton";
import { useDashboard } from "@/components/dashboard/hooks/useDashboard";

const STATUS_COLORS = {
  aceptados: "#013364",
  pendientes: "#4D7093",
  rechazados: "#B3C2D1",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getMonthLabel = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1)
    .toLocaleDateString("es-AR", { month: "short" })
    .replace(".", "");
};

export default function ModoDashboard() {
  const { data, loading, error } = useDashboard();

  if (loading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        Cargando dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Link href="/dashboard" className="text-sm font-semibold text-[#2E7D5B] hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const estadisticas = data?.estadisticas || {};
  const totalEstados = Number(estadisticas.totalEstados) || 0;
  const estados = [
    { name: "Aprobados", value: Number(estadisticas.aceptados) || 0, color: STATUS_COLORS.aceptados },
    { name: "Pendientes", value: Number(estadisticas.pendientes) || 0, color: STATUS_COLORS.pendientes },
    { name: "Rechazados", value: Number(estadisticas.rechazados) || 0, color: STATUS_COLORS.rechazados },
  ];
  const historialMensual = (data?.historialMensual || []).map((item) => ({
    ...item,
    etiqueta: getMonthLabel(item.mes),
    total: Number(item.total) || 0,
  }));
  const tieneActividadMensual = historialMensual.some((item) => item.total > 0);
  const ultimosClientes = data?.ultimosClientes || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-[#0B1001]">Dashboard</h1>
          <p className="text-sm text-gray-500">Resumen de tu actividad y presupuestos</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[#012950]/80">Estado de presupuestos</h2>
        <div className="flex items-center gap-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estados}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={totalEstados ? 4 : 0}
                  dataKey="value"
                >
                  {estados.map((estado) => (
                    <Cell key={estado.name} fill={estado.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[#0B1001]">{totalEstados}</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 text-sm">
            {estados.map((estado) => (
              <div key={estado.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: estado.color }} />
                  {estado.name}
                </span>
                <span className="font-semibold text-gray-800">
                  {totalEstados ? Math.round((estado.value / totalEstados) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#012950]/80">Historial de presupuestos</h2>
          <p className="text-xs text-gray-500">Montos emitidos por mes durante los últimos 12 meses</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="h-48 w-full">
            {tieneActividadMensual ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historialMensual} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="etiqueta" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${Number(value).toLocaleString("es-AR")}`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Total"]}
                    labelFormatter={(label, entries) => entries?.[0]?.payload?.mes || label}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke="#4D7093"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#4D7093" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                Todavía no hay presupuestos para mostrar
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-[#012950]/80">Clientes recientes</h2>
          <Link href="/clientes" className="text-xs font-semibold text-[#2E7D5B] hover:underline">
            Ver clientes
          </Link>
        </div>
        <div className="flex min-h-24 items-center gap-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {ultimosClientes.length ? (
            ultimosClientes.map((cliente) => {
              const iniciales = `${cliente.nombre?.[0] || ""}${cliente.apellido?.[0] || ""}`.toUpperCase();
              return (
                <div key={cliente.id} className="flex min-w-[70px] flex-col items-center gap-1">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4D7093] text-sm font-medium text-white shadow-sm">
                    {iniciales || "CL"}
                  </span>
                  <span className="w-full truncate text-center text-xs text-gray-600">
                    {cliente.nombre} {cliente.apellido || ""}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="w-full py-2 text-center text-xs text-gray-400">Todavía no hay clientes con presupuestos</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#012950]/80">Borradores</h2>
          <Link href="/historial" className="text-sm font-extrabold text-[#4D8F72] hover:underline">
            Ver historial
          </Link>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#B3C2D1] text-lg font-bold text-[#012950]">
            {String(estadisticas.borradores || 0).padStart(2, "0")}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Presupuestos en borrador</p>
            <p className="text-xs text-gray-500">Aún no enviados al cliente</p>
          </div>
        </div>
      </section>
    </div>
  );
}
