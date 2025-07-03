"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Button } from "@/components/ui/button";
import { DialogDetalhesBordero } from "./DialogDetalhesBordero";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
  duplicatas: {
    status: string;
  }[];
}

export default function BorderosTable() {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const [borderos, setBorderos] = useState<Bordero[]>([]);
  const borderosFiltrados = borderos.filter((b) => {
    const nomeMatch = b.cliente.nome
      .toLowerCase()
      .includes(filtroCliente.toLowerCase());
    const statusMatch =
      filtroStatus === "" ||
      b.duplicatas.some((d: { status: string }) => d.status === filtroStatus);
    return nomeMatch && statusMatch;
  });
  const [selectedBordero, setSelectedBordero] = useState<Bordero | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchBorderos() {
    const res = await fetch("/api/bordero");
    const data = await res.json();
    setBorderos(data);
  }

  async function gerarAutomaticamente() {
    setLoading(true);
    const res = await fetch("/api/bordero/gerar", {
      method: "POST",
    });
    setLoading(false);
    if (res.ok) {
      alert("Borderôs gerados com sucesso ✅");
      fetchBorderos();
    } else {
      alert("Erro ao gerar borderôs automaticamente ❌");
    }
  }

  async function gerarManual() {
    const duplicataIds = prompt(
      "Informe os IDs das duplicatas separados por vírgula:"
    );
    if (!duplicataIds) return;

    const ids = duplicataIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (ids.length === 0) {
      alert("Nenhum ID válido informado.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/bordero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duplicataIds: ids }),
    });
    setLoading(false);

    if (res.ok) {
      alert("Borderô gerado manualmente ✅");
      fetchBorderos();
    } else {
      alert("Erro ao gerar borderô manual ❌");
    }
  }

  useEffect(() => {
    fetchBorderos();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-auto">
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          Borderôs Gerados
        </h2>
        <div className="flex gap-2">
          <Link href="/borderos/gerar">
            <Button variant="secondary" size="sm">
              Gerar Borderô Manual
            </Button>
          </Link>
          <Button
            onClick={gerarAutomaticamente}
            disabled={loading}
            variant="default"
            size="sm"
          >
            {loading ? "Gerando..." : "Consolidar Borderôs"}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 pt-2">
        <Input
          placeholder="Filtrar por cliente..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="w-64"
        />
        <Select onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status da duplicata" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PENDENTE">PENDENTE</SelectItem>
            <SelectItem value="ANTECIPADA">ANTECIPADA</SelectItem>
            <SelectItem value="PAGA">PAGA</SelectItem>
            <SelectItem value="CANCELADA">CANCELADA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <table className="w-full text-sm mt-4">
        <thead className="text-left border-b text-zinc-500">
          <tr>
            <th className="p-3">Data</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Valor Bruto</th>
            <th className="p-3">Taxas</th>
            <th className="p-3">Valor Líquido</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {borderosFiltrados.map((b) => (
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
              <td className="p-3 flex gap-2">
                <DialogDetalhesBordero
                  borderoId={b.id}
                  trigger={
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                  }
                />
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
  );
}
