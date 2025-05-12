"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExcluirClienteButton({ clienteId }: { clienteId: string }) {
  async function handleDelete() {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita!"
    );

    if (!confirm) return;

    const res = await fetch(`/api/clientes/${clienteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Cliente excluído com sucesso ✅");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Erro: ${data.error}`);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
