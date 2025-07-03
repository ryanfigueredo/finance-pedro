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
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React from "react";
import { UltimosBorderos } from "./UltimosBorderos";

type Status = "PENDENTE" | "PAGA" | "ANTECIPADA" | "CANCELADA";

interface Duplicata {
  id: string;
  numero: string;
  valor: number;
  status: Status;
  vencimento: string;
  emissao: string;
  resultado?: number;
  sacadoNome: string;
  cliente: {
    nome: string;
  };
  borderoId?: string | null;
}

export function DuplicataTable() {
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [duplicatasSelecionadas, setDuplicatasSelecionadas] = useState<
    string[]
  >([]);
  const [selecionarTodas, setSelecionarTodas] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroBordero, setFiltroBordero] = useState("TODOS");

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

  const duplicatasFiltradas = duplicatas.filter((d) => {
    const statusOk = filtroFinal === "TODOS" || d.status === filtroFinal;
    const borderoOk =
      filtroBordero === "TODOS" ||
      (filtroBordero === "COM" && d.borderoId) ||
      (filtroBordero === "SEM" && !d.borderoId);
    return statusOk && borderoOk;
  });

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

  const diasParaVencer = (vencimento: string): number => {
    const hoje = new Date();
    const venc = new Date(vencimento);
    const diff = Math.ceil(
      (venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          Duplicatas Emitidas
        </h2>
        {duplicatasSelecionadas.length > 0 && (
          <span className="text-sm text-zinc-500 ml-2">
            {duplicatasSelecionadas.length} duplicata(s) selecionada(s)
          </span>
        )}
        {duplicatasSelecionadas.length > 0 &&
          (() => {
            const selecionadas = duplicatas.filter((d) =>
              duplicatasSelecionadas.includes(d.id)
            );
            const clientes = Array.from(
              new Set(selecionadas.map((d) => d.cliente.nome))
            );
            return clientes.length === 1 ? (
              <span className="text-xs text-zinc-400 ml-2">
                Cliente: {clientes[0]}
              </span>
            ) : null;
          })()}

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

          <Select onValueChange={setFiltroBordero} defaultValue={"TODOS"}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por Borderô" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="COM">Com Borderô</SelectItem>
              <SelectItem value="SEM">Sem Borderô</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={duplicatasSelecionadas.length === 0}
              >
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  const selected = duplicatas.filter((d) =>
                    duplicatasSelecionadas.includes(d.id)
                  );
                  const csvContent = [
                    [
                      "Número",
                      "Cliente",
                      "Sacado",
                      "Valor",
                      "Status",
                      "Vencimento",
                    ],
                    ...selected.map((d) => [
                      d.numero,
                      d.cliente.nome,
                      d.sacadoNome,
                      d.valor.toFixed(2),
                      d.status,
                      format(new Date(d.vencimento), "dd/MM/yyyy"),
                    ]),
                  ]
                    .map((e) => e.join(","))
                    .join("\n");

                  const blob = new Blob([csvContent], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", "duplicatas.csv");
                  link.click();
                }}
              >
                Exportar selecionadas (CSV)
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const selecionadas = duplicatas.filter((d) =>
                    duplicatasSelecionadas.includes(d.id)
                  );

                  const nomesClientes = selecionadas.map((d) => d.cliente.nome);
                  const todosMesmoCliente = nomesClientes.every(
                    (nome) => nome === nomesClientes[0]
                  );

                  if (!todosMesmoCliente) {
                    alert(
                      "Selecione duplicatas de um único cliente para gerar o borderô."
                    );
                    return;
                  }

                  const res = await fetch("/api/bordero", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      duplicataIds: duplicatasSelecionadas,
                    }),
                  });

                  if (res.ok) {
                    alert("Borderô gerado com sucesso ✅");
                    window.location.reload();
                  } else {
                    alert("Erro ao gerar borderô ❌");
                  }
                }}
              >
                Gerar Borderô com selecionadas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="min-w-[1000px]">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 border-b">
            <tr>
              <th className="p-2">
                <input
                  type="checkbox"
                  title="Selecionar todas as duplicatas pendentes filtradas"
                  checked={selecionarTodas}
                  onChange={toggleSelecionarTodas}
                />
              </th>
              <th className="text-left p-2">Número</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Sacado</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Emissão</th>
              <th className="text-left p-2">Vencimento</th>
              <th className="text-left p-2">Dias</th>
              <th className="text-left p-2">Resultado</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {duplicatasFiltradas.map((d, index) => (
              <React.Fragment key={d.id}>
                {index > 0 &&
                  d.borderoId !== duplicatasFiltradas[index - 1].borderoId && (
                    <tr>
                      <td colSpan={11} className="py-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wide">
                          <div className="flex-grow h-px bg-zinc-200" />
                          <span>— Novo Borderô —</span>
                          <div className="flex-grow h-px bg-zinc-200" />
                        </div>
                      </td>
                    </tr>
                  )}

                <tr className="border-b last:border-none">
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
                  <td className="p-2">{d.sacadoNome}</td>
                  <td className="p-2">R$ {d.valor.toLocaleString("pt-BR")}</td>
                  <td className="p-2">
                    <Badge
                      variant="outline"
                      className={getBadgeColor(d.status)}
                    >
                      {d.status}
                    </Badge>
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
                  <td className="p-2">
                    <div
                      title={`A duplicata ${
                        diasParaVencer(d.vencimento) < 0
                          ? "venceu há"
                          : "vence em"
                      } ${Math.abs(diasParaVencer(d.vencimento))} dias`}
                      className="cursor-help"
                    >
                      {diasParaVencer(d.vencimento)} dias
                    </div>
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <UltimosBorderos />
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
