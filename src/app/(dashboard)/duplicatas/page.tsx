import { DuplicataTable } from "@/components/duplicatas/DuplicataTable";
import { NovaDuplicataDialog } from "@/components/duplicatas/NovaDuplicataDialog";
import { Suspense } from "react";

export default function DuplicatasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Duplicatas</h1>
        <NovaDuplicataDialog />
      </div>
      <Suspense fallback={<p className="p-4 text-zinc-400">Carregando...</p>}>
        <DuplicataTable />
      </Suspense>
    </div>
  );
}
