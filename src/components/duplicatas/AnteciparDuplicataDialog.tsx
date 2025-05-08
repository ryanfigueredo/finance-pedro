"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  numero: string;
  valor: number;
  taxa: number;
  duplicataId: string;
}

export function AnteciparDuplicataDialog({
  numero,
  valor,
  taxa,
  duplicataId,
}: Props) {
  const valorFinal = valor - valor * taxa;
  const [loading, setLoading] = useState(false);

  async function handleAntecipar() {
    setLoading(true);
    const res = await fetch("/api/antecipacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duplicataId,
        taxa,
        valorFinal,
      }),
    });

    setLoading(false);
    if (res.ok) {
      alert("Antecipação registrada com sucesso ✅");
      window.location.reload();
    } else {
      alert("Erro ao antecipar duplicata");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Antecipar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antecipar Duplicata #{numero}</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-zinc-700 space-y-2">
          <p>
            <strong>Valor original:</strong> R$ {valor.toFixed(2)}
          </p>
          <p>
            <strong>Taxa de antecipação:</strong> {(taxa * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Valor final a receber:</strong> R$ {valorFinal.toFixed(2)}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleAntecipar} disabled={loading}>
            {loading ? "Enviando..." : "Confirmar antecipação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
