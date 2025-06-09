"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExcluirUsuarioButton({ usuarioId }: { usuarioId: string }) {
  async function handleExcluir() {
    const confirmado = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmado) return;

    const res = await fetch(`/api/usuarios/${usuarioId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Usuário excluído ✅");
      window.location.reload();
    } else {
      const data = await res.json();
      toast.error(`Erro ao excluir: ${data.error}`);
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleExcluir}>
      Excluir
    </Button>
  );
}
