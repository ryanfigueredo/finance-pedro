"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function NovaDuplicataDialog() {
  const [valor, setValor] = useState(10000);
  const [desconto, setDesconto] = useState(0);

  const valorComDesconto = valor - valor * (desconto / 100);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">+ Nova Duplicata</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Duplicata</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Número</Label>
            <Input placeholder="000123" />
          </div>

          <div>
            <Label>Cliente</Label>
            <Input placeholder="Nome ou razão social" />
          </div>

          <div>
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Desconto (%)</Label>
            <Input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
            />
            <p className="text-sm text-zinc-500 mt-1">
              Valor com desconto:{" "}
              <strong>R$ {valorComDesconto.toFixed(2)}</strong>
            </p>
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Input type="date" />
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea placeholder="Ex: Pagamento em 15 dias" />
          </div>

          <div>
            <Label>Arquivos (PDF/XML)</Label>
            <Input type="file" multiple />
          </div>

          <Button className="mt-2">Emitir Duplicata</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
