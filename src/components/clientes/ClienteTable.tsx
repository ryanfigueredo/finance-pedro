"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClienteDialog } from "./ClienteDialog";
import { ExcluirClienteButton } from "./ExcluirClienteButton";

type Cliente = {
  id: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  taxaAntecipacao: number;
  taxaBancaria: number;
  taxaServico: number;
  taxaAdicional: number;
  negativado: boolean;
};

export function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function fetchClientes() {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    }

    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.cpfCnpj.replace(/\D/g, "").includes(filtro.replace(/\D/g, ""))
  );

  return (
    <div className="mt-6 bg-white shadow-md rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">
          Clientes Cadastrados
        </h2>

        <Input
          placeholder="Buscar por nome ou CPF/CNPJ"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 border-b">
            <tr>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">CPF/CNPJ</th>
              <th className="text-left p-2">Taxa Antecipação</th>
              <th className="text-left p-2">Taxa Bancária</th>
              <th className="text-left p-2">Taxa Serviço</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c.id} className="border-b last:border-none">
                <td className="p-2">{c.nome}</td>
                <td className="p-2">{c.cpfCnpj}</td>
                <td className="p-2">{c.taxaAntecipacao.toFixed(2)}%</td>
                <td className="p-2">{c.taxaBancaria.toFixed(2)}%</td>
                <td className="p-2">{c.taxaServico.toFixed(2)}%</td>
                <td className="p-2">
                  {c.negativado ? (
                    <Badge className="bg-red-500">Negativado ❌</Badge>
                  ) : (
                    <Badge className="bg-green-500">Regular ✅</Badge>
                  )}
                </td>
                <td className="p-2">
                  <ClienteDialog cliente={c} />
                  <ExcluirClienteButton clienteId={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clientesFiltrados.length === 0 && (
          <div className="text-center text-sm text-zinc-500 mt-4">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
