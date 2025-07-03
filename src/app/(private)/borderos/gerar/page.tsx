"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { BorderoDialog } from "@/components/duplicatas/BorderoDialog";
import { calcularValoresDuplicatas } from "@/utils/calculoBordero";

type Cliente = {
  id: string;
  nome: string;
  taxaAntecipacao: number;
  taxaServico: number;
  taxaBancaria: number;
  taxaAdicional: number;
};

type Duplicata = {
  id: string;
  numero: string;
  valor: number;
  vencimento: string;
  clienteId: string;
};

export default function GerarBorderoPage() {
  const [duplicatas, setDuplicatas] = useState<Duplicata[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDados() {
      const [dupRes, clienteRes] = await Promise.all([
        fetch("/api/duplicatas"),
        fetch("/api/clientes/cliente-atual"), // ajuste conforme sua API
      ]);

      const [dupData, clienteData] = await Promise.all([
        dupRes.json(),
        clienteRes.json(),
      ]);

      const duplicatasPendentes = dupData.filter(
        (d: any) => d.status === "PENDENTE"
      );

      setDuplicatas(duplicatasPendentes);
      setCliente(clienteData);
    }

    fetchDados();
  }, []);

  const toggleSelecionada = (id: string) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const duplicatasSelecionadas = duplicatas.filter((d) =>
    selecionadas.includes(d.id)
  );

  const duplicatasCalculadas = cliente
    ? calcularValoresDuplicatas(duplicatasSelecionadas, cliente)
    : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gerar Borderô Manual</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Número</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {duplicatas.map((d) => (
            <TableRow key={d.id}>
              <TableCell>
                <Checkbox
                  checked={selecionadas.includes(d.id)}
                  onCheckedChange={() => toggleSelecionada(d.id)}
                />
              </TableCell>
              <TableCell>{d.numero}</TableCell>
              <TableCell>
                {" "}
                {format(new Date(d.vencimento), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>R$ {d.valor.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {duplicatasCalculadas.length > 0 && (
        <div className="flex justify-end pt-4">
          <BorderoDialog duplicatas={duplicatasCalculadas} />
        </div>
      )}
    </div>
  );
}
