"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Bordero {
  id: string;
  dataGeracao: string;
  valorBruto: number;
  totalTaxas: number;
  valorLiquido: number;
  cliente: {
    nome: string;
  };
  duplicatas: {
    id: string;
    numero: string;
    sacadoNome: string;
    valor: number;
    vencimento: string;
    resultado: number;
  }[];
}

interface Props {
  borderoId: string;
  trigger: React.ReactNode;
}

export function DialogDetalhesBordero({ borderoId, trigger }: Props) {
  const [bordero, setBordero] = useState<Bordero | null>(null);

  useEffect(() => {
    if (!borderoId) return;
    fetch(`/api/bordero/detail/${borderoId}`)
      .then((res) => res.json())
      .then((data) => setBordero(data))
      .catch(console.error);
  }, [borderoId]);

  if (!bordero) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Borderô de {bordero.cliente.nome} -{" "}
            {format(new Date(bordero.dataGeracao), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-zinc-700 space-y-4">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-zinc-100">
                <th className="p-2 text-left">Nº</th>
                <th className="p-2 text-left">Sacado</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Vencimento</th>
                <th className="p-2 text-left">Resultado</th>
                <th className="p-2 text-left">Dias</th>
              </tr>
            </thead>
            <tbody>
              {bordero.duplicatas.map((d) => {
                const dias = Math.ceil(
                  (new Date(d.vencimento).getTime() -
                    new Date(bordero.dataGeracao).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{d.numero}</td>
                    <td className="p-2">{d.sacadoNome}</td>
                    <td className="p-2">R$ {d.valor.toFixed(2)}</td>
                    <td className="p-2">
                      {format(new Date(d.vencimento), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="p-2 text-green-600 font-semibold">
                      R$ {d.resultado.toFixed(2)}
                    </td>
                    <td className="p-2">{dias} dias</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 text-sm">
            <p>
              <strong>Valor Bruto:</strong> R$ {bordero.valorBruto.toFixed(2)}
            </p>
            <p>
              <strong>Total de Taxas:</strong> R${" "}
              {bordero.totalTaxas.toFixed(2)}
            </p>
            <p>
              <strong>Valor Líquido:</strong> R${" "}
              {bordero.valorLiquido.toFixed(2)}
            </p>
          </div>

          <Link
            href={`/api/bordero/${bordero.id}/pdf`}
            target="_blank"
            className="block mt-4"
          >
            <Button variant="secondary" size="sm">
              Exportar PDF
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
