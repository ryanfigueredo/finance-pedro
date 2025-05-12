"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExcluirClienteButton({ clienteId }: { clienteId: string }) {
  async function handleDelete() {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita!"
    );

    if (!confirm) return;

    try {
      const res = await fetch(`/api/clientes/${clienteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Cliente excluído com sucesso ✅");
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(`Erro ao excluir cliente: ${data.error}`);
      }
    } catch (error) {
      toast.error("Erro interno ao excluir cliente ❌");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      title="Excluir cliente"
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  );
}
