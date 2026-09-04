export function formatMonto(valor, moneda = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

export function formatFecha(fechaISO, opts = {}) {
  const d = new Date(fechaISO);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", ...opts });
}

export function formatFechaCorta(fechaISO) {
  const d = new Date(fechaISO);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export function diasRestantesTexto(dias, estado) {
  if (estado === "aprobado") return "Aprobado";
  if (estado === "rechazado") return "Rechazado";
  if (dias < 0) return `Venció hace ${Math.abs(dias)}d`;
  if (dias === 0) return "Vence hoy";
  return `Vence en ${dias}d`;
}

export function creadoRelativoTexto(fechaISO) {
  const creado = new Date(fechaISO);
  const hoy = new Date();
  creado.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((hoy - creado) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
}

export const ESTADO_LABEL = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  borrador: "Borrador",
  rechazado: "Rechazado",
};
