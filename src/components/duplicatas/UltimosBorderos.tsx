"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Bordero {
  id: string;
  dataGeracao: string;
  valorBruto: number;
  totalTaxas: number;
  valorLiquido: number;
  cliente: {
    nome: string;
  };
}

export function UltimosBorderos() {
  const [borderos, setBorderos] = useState<Bordero[]>([]);

  useEffect(() => {
    async function fetchBorderos() {
      const res = await fetch("/api/bordero");
      const data = await res.json();
      setBorderos(data.slice(0, 3)); // pega os 3 mais recentes
    }

    fetchBorderos();
  }, []);

  if (borderos.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted rounded-xl p-4 mt-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-zinc-600 uppercase tracking-wide">
          Últimos Borderôs
        </h3>
        <Link href="/borderos">
          <Button size="sm" variant="outline">
            Ver todos
          </Button>
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left border-b text-zinc-500">
          <tr>
            <th className="p-2">Data</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Bruto</th>
            <th className="p-2">Taxas</th>
            <th className="p-2">Líquido</th>
          </tr>
        </thead>
        <tbody>
          {borderos.map((b) => (
            <tr key={b.id} className="border-b last:border-none">
              <td className="p-2">
                {format(new Date(b.dataGeracao), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </td>
              <td className="p-2">{b.cliente.nome}</td>
              <td className="p-2">R$ {b.valorBruto.toFixed(2)}</td>
              <td className="p-2">R$ {b.totalTaxas.toFixed(2)}</td>
              <td className="p-2">R$ {b.valorLiquido.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
