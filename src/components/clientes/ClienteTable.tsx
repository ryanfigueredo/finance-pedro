"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type Cliente = {
  id: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  taxa1: number;
  taxa2: number;
  taxa3: number;
  negativado: boolean;
};

const mockClientes: Cliente[] = [
  {
    id: "1",
    nome: "Maria Souza",
    cpfCnpj: "123.456.789-00",
    email: "maria@email.com",
    telefone: "(11) 99999-0000",
    taxa1: 2.5,
    taxa2: 1.2,
    taxa3: 0.8,
    negativado: false,
  },
  {
    id: "2",
    nome: "João Silva",
    cpfCnpj: "987.654.321-00",
    email: "joao@email.com",
    telefone: "(11) 98888-1111",
    taxa1: 3.1,
    taxa2: 1.0,
    taxa3: 0.5,
    negativado: true,
  },
];

export function ClienteTable() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [busca, setBusca] = useState("");

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cpfCnpj.includes(busca)
  );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">Clientes</h2>
        <Input
          placeholder="Buscar por nome ou CPF/CNPJ"
          className="w-64"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table className="w-full text-sm">
        <thead className="text-zinc-500 border-b">
          <tr>
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">CPF/CNPJ</th>
            <th className="text-left p-2">Taxa 1</th>
            <th className="text-left p-2">Negativado</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id} className="border-b last:border-none">
              <td className="p-2">{c.nome}</td>
              <td className="p-2">{c.cpfCnpj}</td>
              <td className="p-2">{c.taxa1.toFixed(2)}%</td>
              <td className="p-2">{c.negativado ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
