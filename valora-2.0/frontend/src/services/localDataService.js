import { getLocalSessionUser } from "@/services/localAuthService";

const DATA_KEY = "valora_local_data_v1";

const readWorkspace = (userId) => {
  let workspaces;
  try {
    workspaces = JSON.parse(window.localStorage.getItem(DATA_KEY) || "{}");
  } catch {
    throw new Error("No se pudieron leer los datos locales de VALORA.");
  }

  return workspaces[userId] || {
    clientes: [],
    items: [],
    presupuestos: [],
  };
};

const monthStart = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const dateForBudget = (budget) =>
  new Date(`${budget.fecha || budget.created_at}T00:00:00`);

export const getLocalDashboardData = (periodo = "semanal") => {
  const user = getLocalSessionUser();
  if (!user) {
    throw new Error("La sesión local venció. Iniciá sesión nuevamente.");
  }

  const { presupuestos, clientes } = readWorkspace(user.id);
  const today = new Date();
  const currentMonth = monthStart(today);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const currentMonthBudgets = presupuestos.filter((budget) => {
    const date = dateForBudget(budget);
    return date >= currentMonth && date < new Date(today.getFullYear(), today.getMonth() + 1, 1);
  });
  const previousMonthBudgets = presupuestos.filter((budget) => {
    const date = dateForBudget(budget);
    return date >= previousMonth && date < currentMonth;
  });

  const statusCount = (items, states) =>
    items.filter((item) => states.includes(item.estado)).length;
  const sumTotals = (items) =>
    items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  let activityStart = new Date(today);
  if (periodo === "semanal") {
    const offset = today.getDay() === 0 ? 6 : today.getDay() - 1;
    activityStart.setDate(today.getDate() - offset);
    activityStart.setHours(0, 0, 0, 0);
  } else if (periodo === "mensual") {
    activityStart.setDate(today.getDate() - 29);
    activityStart.setHours(0, 0, 0, 0);
  } else {
    activityStart.setHours(0, 0, 0, 0);
  }

  const activity = new Map();
  presupuestos.forEach((budget) => {
    const date = dateForBudget(budget);
    if (date < activityStart || date > today) {
      return;
    }

    const key = periodo === "diario"
      ? `${String(date.getHours()).padStart(2, "0")}:00`
      : periodo === "mensual"
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        : date.toLocaleDateString("en-US", { weekday: "short" });
    const counts = activity.get(key) || { dia: key, pendientes: 0, aprobados: 0, rechazados: 0 };

    if (["Guardado", "Enviado"].includes(budget.estado)) counts.pendientes += 1;
    if (budget.estado === "Aceptado") counts.aprobados += 1;
    if (budget.estado === "Rechazado") counts.rechazados += 1;
    activity.set(key, counts);
  });

  const historialMensual = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 11 + index, 1);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const monthBudgets = presupuestos.filter((budget) => {
      const budgetDate = dateForBudget(budget);
      return budgetDate >= date && budgetDate < nextMonth;
    });
    return {
      mes: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      total: sumTotals(monthBudgets),
    };
  });

  const latestClientIds = new Set(
    [...presupuestos]
      .sort((a, b) => dateForBudget(b) - dateForBudget(a))
      .map((budget) => budget.cliente_id)
      .filter(Boolean)
  );
  const ultimosClientes = [...latestClientIds]
    .map((id) => clientes.find((cliente) => cliente.id === id))
    .filter(Boolean)
    .slice(0, 5);
  const approved = presupuestos.filter((budget) => budget.estado === "Aceptado").length;
  const rejected = statusCount(presupuestos, ["Rechazado"]);
  const draft = statusCount(presupuestos, ["Borrador"]);

  return {
    estadisticas: {
      sumaTotal: sumTotals(presupuestos),
      sumaTotalMes: sumTotals(currentMonthBudgets),
      sumaTotalMesAnterior: sumTotals(previousMonthBudgets),
      guardados: statusCount(presupuestos, ["Guardado"]),
      aceptados: approved,
      rechazados: rejected,
      borradores: draft,
      pendientes: statusCount(presupuestos, ["Guardado", "Enviado"]),
      totalEstados: presupuestos.filter((budget) => budget.estado !== "Borrador").length,
      presupuestosMes: currentMonthBudgets.length,
      aceptadosMes: statusCount(currentMonthBudgets, ["Aceptado"]),
      rechazadosMes: statusCount(currentMonthBudgets, ["Rechazado"]),
      totalPresupuestos: presupuestos.length,
      usuarioNombre: user.nombre,
      usuarioApellido: user.apellido,
    },
    actividadSemanal: [...activity.values()],
    historialMensual,
    ultimosClientes,
  };
};

export const getLocalPresupuestos = (pagina = 1, limite = 10) => {
  const user = getLocalSessionUser();
  if (!user) {
    throw new Error("La sesión local venció. Iniciá sesión nuevamente.");
  }
  const presupuestos = readWorkspace(user.id).presupuestos
    .slice()
    .sort((a, b) => dateForBudget(b) - dateForBudget(a));
  const inicio = (pagina - 1) * limite;
  return {
    success: true,
    data: presupuestos.slice(inicio, inicio + limite),
    meta: {
      total: presupuestos.length,
      pagina,
      limite,
      totalPaginas: Math.max(1, Math.ceil(presupuestos.length / limite)),
    },
  };
};
