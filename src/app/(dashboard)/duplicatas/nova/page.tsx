"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NovaDuplicataPage() {
  const [desconto, setDesconto] = useState(0);
  const [valor, setValor] = useState(10000);

  const valorComDesconto = valor - valor * (desconto / 100);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Nova Duplicata</h1>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Número da duplicata</Label>
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
          <Label>Porcentagem de Desconto (%)</Label>
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
          <Textarea placeholder="Ex: Cliente negociou pagamento em 15 dias..." />
        </div>

        <div>
          <Label>Upload de arquivos (PDF/XML)</Label>
          <Input type="file" multiple />
        </div>

        <Button className="mt-4 w-full">Emitir Duplicata</Button>
      </div>
    </div>
  );
}
