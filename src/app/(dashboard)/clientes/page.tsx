import { ClientesTable } from "@/components/clientes/ClienteTable";
import { ClienteDialog } from "@/components/clientes/ClienteDialog";

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <ClienteDialog />
      </div>

      <ClientesTable />
    </div>
  );
}
