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
  taxa: number; // Ex: 0.03 (3%)
}

export function AnteciparDuplicataDialog({ numero, valor, taxa }: Props) {
  const valorFinal = valor - valor * taxa;

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
          <Button>Confirmar antecipação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
