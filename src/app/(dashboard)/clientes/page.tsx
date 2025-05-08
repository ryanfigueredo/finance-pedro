import { ClienteTable } from "@/components/clientes/ClienteTable";
import { NovoClienteDialog } from "@/components/clientes/NovoClienteDialog";

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <NovoClienteDialog />
      </div>

      <ClienteTable />
    </div>
  );
}
