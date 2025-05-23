"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NovaDuplicataDialog() {
  const [numero, setNumero] = useState("");
  const [valor, setValor] = useState(10000);
  const [vencimento, setVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [resultado, setResultado] = useState<number | null>(null);

  const { data: session } = useSession();

  async function handleSubmit() {
    setLoading(true);

    if (!numero || !clienteId || !valor || !vencimento) {
      alert("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/duplicatas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          valor,
          vencimento,
          observacoes,
          clienteId,
          userId: "f38f31fd-0974-4475-9aa3-4aab0c6d6a70", // mockado temporariamente
        }),
      });

      setLoading(false);

      const data = await res.json();

      if (res.ok) {
        alert("Duplicata emitida com sucesso ✅");
        window.location.reload();
      } else {
        alert(
          `Erro ao emitir duplicata: ${data?.error ?? "Erro desconhecido"}`
        );
      }
    } catch (error) {
      setLoading(false);
      alert("Erro inesperado ao emitir duplicata.");
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setClientes([]);
      }
    }

    fetchClientes();
  }, []);

  useEffect(() => {
    if (!clienteSelecionado || !valor || !vencimento) {
      setResultado(null);
      return;
    }

    const venc = new Date(vencimento);
    const hoje = new Date();
    const dias = Math.max(
      1,
      Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    );

    const taxaComposta =
      Math.pow(1 + clienteSelecionado.taxaAntecipacao / 100, dias) - 1;

    const totalTaxasPercentuais =
      taxaComposta + (clienteSelecionado.taxaServico ?? 0) / 100;

    const totalTaxasFixas =
      (clienteSelecionado.taxaBancaria ?? 0) +
      (clienteSelecionado.taxaAdicional ?? 0);

    const r = valor - (valor * totalTaxasPercentuais + totalTaxasFixas);
    setResultado(Number(r.toFixed(2)));
  }, [clienteSelecionado, valor, vencimento]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">+ Nova Duplicata</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Duplicata</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Número</Label>
            <Input
              placeholder="000123"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div>
            <Label>Cliente</Label>
            <Select
              onValueChange={(value) => {
                setClienteId(value);
                const c = clientes.find((cli) => cli.id === value);
                setClienteSelecionado(c ?? null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
            {resultado !== null && (
              <p className="text-sm text-green-600 mt-1">
                Resultado estimado:{" "}
                <strong>R$ {resultado.toLocaleString("pt-BR")}</strong>
              </p>
            )}
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              placeholder="Ex: Pagamento em 15 dias"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div>
            <Label>Arquivos (PDF/XML)</Label>
            <Input type="file" multiple />
          </div>

          <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Emitir Duplicata"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
