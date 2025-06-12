"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Filtro {
  cliente?: string;
  sacado?: string;
  status?: string;
  inicio?: string;
  fim?: string;
}

interface Duplicata {
  id: string;
  numero: string;
  cliente: { nome: string };
  sacadoNome: string;
  valor: number;
  status: string;
  emissao: string;
  vencimento: string;
  resultado?: number;
}

export default function PainelGerencialPage() {
  const [filtros, setFiltros] = useState<Filtro>({});
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRelatorio() {
    setLoading(true);
    const params = new URLSearchParams(filtros as Record<string, string>);
    const res = await fetch("/api/relatorios/duplicatas?" + params.toString());
    const data = await res.json();
    setDuplicatas(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRelatorio();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Relatório Gerencial</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Input
          type="date"
          onChange={(e) =>
            setFiltros((f) => ({ ...f, inicio: e.target.value }))
          }
        />
        <Input
          type="date"
          onChange={(e) => setFiltros((f) => ({ ...f, fim: e.target.value }))}
        />

        <Input
          placeholder="Cliente"
          onChange={(e) =>
            setFiltros((f) => ({ ...f, cliente: e.target.value }))
          }
        />
        <Input
          placeholder="Sacado"
          onChange={(e) =>
            setFiltros((f) => ({ ...f, sacado: e.target.value }))
          }
        />
        <Select
          onValueChange={(value) =>
            setFiltros((f) => ({ ...f, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="ANTECIPADA">Antecipada</SelectItem>
            <SelectItem value="PAGA">Paga</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchRelatorio} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      <Button
        onClick={() => {
          const csv = [
            [
              "Número",
              "Cliente",
              "Sacado",
              "Valor",
              "Status",
              "Emissão",
              "Vencimento",
              "Resultado",
            ],
            ...duplicatas.map((d) => [
              d.numero,
              d.cliente.nome,
              d.sacadoNome,
              d.valor.toFixed(2),
              d.status,
              format(new Date(d.emissao), "dd/MM/yyyy"),
              format(new Date(d.vencimento), "dd/MM/yyyy"),
              d.resultado?.toFixed(2) ?? "-",
            ]),
          ]
            .map((linha) => linha.join(","))
            .join("\n");

          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "relatorio_duplicatas.csv");
          link.click();
        }}
        className="mt-4"
      >
        Exportar CSV
      </Button>

      <div className="overflow-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100">
            <tr>
              <th className="p-2 text-left">Número</th>
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left">Sacado</th>
              <th className="p-2 text-left">Valor</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Emissão</th>
              <th className="p-2 text-left">Vencimento</th>
              <th className="p-2 text-left">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {duplicatas.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.numero}</td>
                <td className="p-2">{d.cliente.nome}</td>
                <td className="p-2">{d.sacadoNome}</td>
                <td className="p-2">R$ {d.valor.toFixed(2)}</td>
                <td className="p-2">{d.status}</td>
                <td className="p-2">
                  {format(new Date(d.emissao), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="p-2">
                  {format(new Date(d.vencimento), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="p-2">
                  {d.resultado ? `R$ ${d.resultado.toFixed(2)}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-50 font-semibold">
              <td className="p-2" colSpan={3}>
                Total: {duplicatas.length} duplicata(s)
              </td>
              <td className="p-2">
                R$ {duplicatas.reduce((acc, d) => acc + d.valor, 0).toFixed(2)}
              </td>
              <td />
              <td />
              <td />
              <td className="p-2">
                R${" "}
                {duplicatas
                  .reduce((acc, d) => acc + (d.resultado ?? 0), 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
