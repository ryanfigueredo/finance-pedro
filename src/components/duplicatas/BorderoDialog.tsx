"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Duplicata = {
  id: string;
  numero: string;
  valor: number;
  vencimento: string;
  diasRestantes: number;
  taxa: number;
  valorLiquido: number;
};

type BorderoProps = {
  duplicatas: Duplicata[];
};

export function BorderoDialog({ duplicatas }: BorderoProps) {
  const [loading, setLoading] = useState(false);

  const totalDuplicatas = duplicatas.length;
  const valorBrutoTotal = duplicatas.reduce((acc, d) => acc + d.valor, 0);
  const valorLiquidoTotal = duplicatas.reduce(
    (acc, d) => acc + d.valorLiquido,
    0
  );
  const prazoMedio =
    duplicatas.reduce((acc, d) => acc + d.diasRestantes, 0) / totalDuplicatas;
  const totalTaxas = valorBrutoTotal - valorLiquidoTotal;

  async function handleSalvar() {
    if (duplicatas.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/bordero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duplicataIds: duplicatas.map((d) => d.id),
        }),
      });

      if (res.ok) {
        alert("Borderô salvo com sucesso ✅");
        window.location.href = "/borderos";
      } else {
        alert("Erro ao salvar o borderô ❌");
      }
    } catch (error) {
      alert("Erro inesperado ao salvar o borderô ❌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Gerar Borderô</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Borderô</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor Bruto</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Valor Líquido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duplicatas.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.numero}</TableCell>
                <TableCell>{d.vencimento}</TableCell>
                <TableCell>R$ {d.valor.toFixed(2)}</TableCell>
                <TableCell>{d.diasRestantes}</TableCell>
                <TableCell>{d.taxa}%</TableCell>
                <TableCell>R$ {d.valorLiquido.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 text-sm space-y-1">
          <p>
            <strong>Total de duplicatas:</strong> {totalDuplicatas}
          </p>
          <p>
            <strong>Valor bruto total:</strong> R$ {valorBrutoTotal.toFixed(2)}
          </p>
          <p>
            <strong>Total de taxas:</strong> R$ {totalTaxas.toFixed(2)}
          </p>
          <p>
            <strong>Valor líquido total:</strong> R${" "}
            {valorLiquidoTotal.toFixed(2)}
          </p>
          <p>
            <strong>Prazo médio:</strong> {prazoMedio.toFixed(0)} dias
          </p>
        </div>

        <div className="bg-muted p-4 mt-6 rounded text-xs">
          <strong>Declaração de responsabilidade:</strong>
          <p className="mt-1">
            Declaro, como cedente, que autorizo a antecipação das duplicatas
            listadas neste borderô, responsabilizando-me por eventuais
            inconsistências ou inadimplências nos títulos apresentados.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSalvar} disabled={loading}>
            {loading ? "Salvando..." : "Confirmar e salvar Borderô"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
