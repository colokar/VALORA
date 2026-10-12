"use client";

import { use } from "react";
import PresupuestoDetalle from "@/components/presupuesto/PresupuestoDetalle";

export default function Page({ params }) {
  // Resolvemos la promesa de los params de Next.js de forma segura
  const resolvedParams = use(params);
  const { id } = resolvedParams || {};

  return <PresupuestoDetalle params={{ id }} />;
}
