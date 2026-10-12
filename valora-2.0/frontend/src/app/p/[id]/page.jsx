import PresupuestoPublico from "@/components/presupuesto/PresupuestoPublico";

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        <PresupuestoPublico presupuestoId={id} />
      </div>
    </main>
  );
}