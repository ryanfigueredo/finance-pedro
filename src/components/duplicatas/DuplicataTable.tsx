"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { AnteciparDuplicataDialog } from "./AnteciparDuplicataDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "PENDENTE" | "PAGA" | "ANTECIPADA" | "CANCELADA";

interface Duplicata {
  id: string;
  numero: string;
  valor: number;
  status: Status;
  vencimento: string;
  cliente: {
    nome: string;
  };
}

export function DuplicataTable() {
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    async function fetchDuplicatas() {
      const res = await fetch("/api/duplicatas");
      const data = await res.json();
      setDuplicatas(data);
    }

    fetchDuplicatas();
  }, []);

  const duplicatasFiltradas = duplicatas.filter(
    (d) => filtroStatus === "TODOS" || d.status === filtroStatus
  );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          Duplicatas Emitidas
        </h2>

        <Select onValueChange={setFiltroStatus} defaultValue="TODOS">
          <SelectTrigger className="w-40">
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
          <thead className="text-zinc-500 border-b">
            <tr>
              <th className="text-left p-2">Número</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Vencimento</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {duplicatasFiltradas.map((d) => (
              <tr key={d.id} className="border-b last:border-none">
                <td className="p-2">{d.numero}</td>
                <td className="p-2">{d.cliente.nome}</td>
                <td className="p-2">R$ {d.valor.toLocaleString("pt-BR")}</td>
                <td className="p-2">
                  <Badge variant="outline" className={getBadgeColor(d.status)}>
                    {d.status}
                  </Badge>
                </td>
                <td className="p-2">
                  {format(new Date(d.vencimento), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="p-2">
                  {d.status === "PENDENTE" ? (
                    <AnteciparDuplicataDialog
                      numero={d.numero}
                      valor={d.valor}
                      taxa={0.03}
                      duplicataId={d.id}
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getBadgeColor(status: Status) {
  switch (status) {
    case "PENDENTE":
      return "border-yellow-400 text-yellow-500";
    case "PAGA":
      return "border-green-400 text-green-600";
    case "ANTECIPADA":
      return "border-blue-400 text-blue-600";
    case "CANCELADA":
      return "border-red-400 text-red-600";
  }
}
