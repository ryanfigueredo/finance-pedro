"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Duplicata {
  id: string;
  numero: string;
  valor: number;
  status: string;
  vencimento: string;
  emissao: string;
  resultado?: number;
  sacadoNome: string;
  clienteId: string;
}

export default function MinhasDuplicatasPage() {
  const { data: session } = useSession();
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/duplicatas")
      .then((res) => res.json())
      .then((data) => {
        const minhas = data.filter(
          (d: Duplicata) => d.clienteId === session.user.id
        );
        setDuplicatas(minhas);
      })
      .catch(() => setDuplicatas([]));
  }, [session]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Minhas Duplicatas</h1>

      {duplicatas.length === 0 ? (
        <p className="text-zinc-500">Nenhuma duplicata encontrada.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-500 border-b">
              <tr>
                <th className="p-2">Nº</th>
                <th className="p-2">Sacado</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Status</th>
                <th className="p-2">Emissão</th>
                <th className="p-2">Vencimento</th>
                <th className="p-2">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {duplicatas.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="p-2">{d.numero}</td>
                  <td className="p-2">{d.sacadoNome}</td>
                  <td className="p-2">R$ {d.valor.toFixed(2)}</td>
                  <td className="p-2">
                    <Badge variant="outline">{d.status}</Badge>
                  </td>
                  <td className="p-2">
                    {format(new Date(d.emissao), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </td>
                  <td className="p-2">
                    {format(new Date(d.vencimento), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </td>
                  <td className="p-2 text-right">
                    {d.resultado ? `R$ ${d.resultado.toFixed(2)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
