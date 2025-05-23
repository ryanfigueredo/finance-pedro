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
import { useSearchParams } from "next/navigation";

type Status = "PENDENTE" | "PAGA" | "ANTECIPADA" | "CANCELADA";

interface Duplicata {
  id: string;
  numero: string;
  valor: number;
  status: Status;
  vencimento: string;
  resultado?: number;
  cliente: {
    nome: string;
  };
}

export function DuplicataTable() {
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [duplicatasSelecionadas, setDuplicatasSelecionadas] = useState<
    string[]
  >([]);
  const [selecionarTodas, setSelecionarTodas] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [mostrarResumo, setMostrarResumo] = useState(false);

  const searchParams = useSearchParams();
  const statusFiltrado = searchParams.get("status");
  const filtroFinal = statusFiltrado ?? filtroStatus;

  useEffect(() => {
    async function fetchDuplicatas() {
      const res = await fetch("/api/duplicatas");
      const data = await res.json();
      setDuplicatas(data);
    }

    fetchDuplicatas();
  }, []);

  const duplicatasFiltradas = duplicatas.filter(
    (d) => filtroFinal === "TODOS" || d.status === filtroFinal
  );

  const toggleSelecionar = (id: string) => {
    setDuplicatasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelecionarTodas = () => {
    if (selecionarTodas) {
      setDuplicatasSelecionadas([]);
    } else {
      const idsPendentes = duplicatasFiltradas
        .filter((d) => d.status === "PENDENTE")
        .map((d) => d.id);
      setDuplicatasSelecionadas(idsPendentes);
    }
    setSelecionarTodas(!selecionarTodas);
  };

  const handleDescontar = () => {
    if (duplicatasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma duplicata pendente.");
      return;
    }
    setMostrarResumo(true);
  };

  const duplicatasSelecionadasData = duplicatas
    .filter((d) => duplicatasSelecionadas.includes(d.id))
    .map((d) => ({
      id: d.id,
      numero: d.numero,
      valor: d.valor,
      valorComDesconto: d.valor * 0.94, // simula 6% de desconto
    }));

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          Duplicatas Emitidas
        </h2>

        <div className="flex items-center gap-2">
          <Select onValueChange={setFiltroStatus} defaultValue={filtroFinal}>
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
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 border-b">
            <tr>
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={selecionarTodas}
                  onChange={toggleSelecionarTodas}
                />
              </th>
              <th className="text-left p-2">Número</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Vencimento</th>
              <th className="text-left p-2">Resultado</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {duplicatasFiltradas.map((d) => (
              <tr key={d.id} className="border-b last:border-none">
                <td className="p-2">
                  <input
                    type="checkbox"
                    disabled={d.status !== "PENDENTE"}
                    checked={duplicatasSelecionadas.includes(d.id)}
                    onChange={() => toggleSelecionar(d.id)}
                  />
                </td>
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
                <td className="p-2 text-right">
                  {d.resultado ? `R$ ${d.resultado.toFixed(2)}` : "-"}
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
