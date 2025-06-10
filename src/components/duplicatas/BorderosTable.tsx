"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default function BorderosTable() {
  const [borderos, setBorderos] = useState<Bordero[]>([]);
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
          <Button
            onClick={gerarManual}
            disabled={loading}
            variant="secondary"
            size="sm"
          >
            Gerar Borderô Manual
          </Button>
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
              <td className="p-3 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBordero(b)}
                    >
                      Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Borderô de {b.cliente.nome} -{" "}
                        {format(new Date(b.dataGeracao), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-zinc-700 space-y-2">
                      <p>
                        <strong>Valor Bruto:</strong> R${" "}
                        {b.valorBruto.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <strong>Taxas:</strong> R${" "}
                        {b.totalTaxas.toLocaleString("pt-BR")}
                      </p>
                      <p>
                        <strong>Valor Líquido:</strong> R${" "}
                        {b.valorLiquido.toLocaleString("pt-BR")}
                      </p>
                      <Link
                        href={`/api/bordero/${b.id}/pdf`}
                        target="_blank"
                        className="block mt-4"
                      >
                        <Button variant="secondary" size="sm">
                          Visualizar PDF
                        </Button>
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
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
