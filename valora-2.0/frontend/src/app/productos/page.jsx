import { ItemsPage } from "@/components/items/ItemsHome";


export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto">
          <ItemsPage />
        </div>
      </main>
    </>
  );
}
