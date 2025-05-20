"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Duplicata {
  id: string;
  numero: string;
  valor: number;
  valorComDesconto?: number;
}

interface Props {
  duplicatas: Duplicata[];
  onClose: () => void;
}

export function ModalResumoBordero({ duplicatas }: Props) {
  const [open, setOpen] = useState(false);

  const totalBruto = duplicatas.reduce((acc, d) => acc + d.valor, 0);
  const totalLiquido = duplicatas.reduce(
    (acc, d) => acc + (d.valorComDesconto ?? d.valor),
    0
  );
  const totalDescontos = totalBruto - totalLiquido;

  const handleGerarContrato = () => {
    console.log("📝 Gerando contrato para duplicatas:", duplicatas);
    alert("Contrato gerado com sucesso (simulado)");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Descontar duplicatas selecionadas</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resumo do Borderô</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <table className="w-full text-sm">
            <thead className="text-zinc-500 border-b">
              <tr>
                <th className="text-left p-2">Número</th>
                <th className="text-left p-2">Valor Bruto</th>
                <th className="text-left p-2">Valor Líquido</th>
              </tr>
            </thead>
            <tbody>
              {duplicatas.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="p-2">{d.numero}</td>
                  <td className="p-2">R$ {d.valor.toFixed(2)}</td>
                  <td className="p-2">
                    R$ {(d.valorComDesconto ?? d.valor).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4">
            <p className="text-sm">
              Total bruto: <strong>R$ {totalBruto.toFixed(2)}</strong>
            </p>
            <p className="text-sm">
              Total descontos: <strong>R$ {totalDescontos.toFixed(2)}</strong>
            </p>
            <p className="text-sm">
              Valor líquido: <strong>R$ {totalLiquido.toFixed(2)}</strong>
            </p>
          </div>

          <Button className="mt-4" onClick={handleGerarContrato}>
            Gerar contrato
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
