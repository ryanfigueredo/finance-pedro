"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  cliente: {
    nome: string;
  };
}

export default function RelatoriosPage() {
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroSacado, setFiltroSacado] = useState("");

  useEffect(() => {
    fetch("/api/duplicatas")
      .then((res) => res.json())
      .then(setDuplicatas)
      .catch(() => setDuplicatas([]));
  }, []);

  const duplicatasFiltradas = duplicatas.filter((d) => {
    return (
      (filtroStatus === "TODOS" || d.status === filtroStatus) &&
      (!filtroCliente ||
        d.cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase())) &&
      (!filtroSacado ||
        d.sacadoNome.toLowerCase().includes(filtroSacado.toLowerCase()))
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Relatório Gerencial</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <Input
          placeholder="Filtrar por cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="w-64"
        />
        <Input
          placeholder="Filtrar por sacado"
          value={filtroSacado}
          onChange={(e) => setFiltroSacado(e.target.value)}
          className="w-64"
        />
        <Select onValueChange={setFiltroStatus} defaultValue="TODOS">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="ANTECIPADA">Antecipada</SelectItem>
            <SelectItem value="PAGA">Paga</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-500 border-b">
            <tr>
              <th className="p-2">Nº</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Sacado</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Status</th>
              <th className="p-2">Emissão</th>
              <th className="p-2">Vencimento</th>
              <th className="p-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {duplicatasFiltradas.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.numero}</td>
                <td className="p-2">{d.cliente.nome}</td>
                <td className="p-2">{d.sacadoNome}</td>
                <td className="p-2">R$ {d.valor.toFixed(2)}</td>
                <td className="p-2">
                  <Badge variant="outline">{d.status}</Badge>
                </td>
                <td className="p-2">
                  {format(new Date(d.emissao), "dd/MM/yyyy", { locale: ptBR })}
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
    </div>
  );
}
