"use client";

import BorderosTable from "@/components/duplicatas/BorderosTable";

export default function BorderosPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Borderôs Gerados</h1>
      <BorderosTable />
    </div>
  );
}
