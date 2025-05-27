"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
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

export default function BorderosPage() {
  const [borderos, setBorderos] = useState<Bordero[]>([]);

  useEffect(() => {
    async function fetchBorderos() {
      const res = await fetch("/api/bordero");
      const data = await res.json();
      setBorderos(data);
    }

    fetchBorderos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Borderôs Gerados</h1>

      <div className="bg-white shadow-md rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b text-zinc-500">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Valor Bruto</th>
              <th className="p-3">Taxas</th>
              <th className="p-3">Valor Líquido</th>
              <th className="p-3">Contrato</th>
            </tr>
          </thead>
          <tbody>
            {borderos.map((b) => (
              <tr key={b.id} className="border-b last:border-none">
                <td className="p-3">
                  {format(new Date(b.dataGeracao), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="p-3">{b.cliente.nome}</td>
                <td className="p-3">R$ {b.valorBruto.toFixed(2)}</td>
                <td className="p-3">R$ {b.totalTaxas.toFixed(2)}</td>
                <td className="p-3">R$ {b.valorLiquido.toFixed(2)}</td>
                <td className="p-3">
                  <Link href={`/api/bordero/${b.id}/pdf`} target="_blank">
                    <Button size="sm" variant="outline">
                      Ver PDF
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}

            {borderos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-zinc-400">
                  Nenhum borderô gerado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
