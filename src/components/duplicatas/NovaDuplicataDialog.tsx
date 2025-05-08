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
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";

export function NovaDuplicataDialog() {
  const [numero, setNumero] = useState("");
  const [valor, setValor] = useState(10000);
  const [desconto, setDesconto] = useState(0);
  const [vencimento, setVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [clienteId, setClienteId] = useState("");

  const { data: session } = useSession(); // ✅ esta linha deve estar aqui!

  const valorComDesconto = valor - valor * (desconto / 100);

  async function handleSubmit() {
    setLoading(true);

    const res = await fetch("/api/duplicatas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero,
        valor,
        valorComDesconto,
        vencimento,
        observacoes,
        clienteId,
        userId: (session?.user as any)?.id,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Duplicata emitida com sucesso ✅");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Erro ao emitir duplicata: ${data.error}`);
    }
  }

  useEffect(() => {
    async function fetchClientes() {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    }

    fetchClientes();
  }, []);

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
            <Select onValueChange={(value) => setClienteId(value)}>
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
            <Label>Desconto (%)</Label>
            <Input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
            />
            <p className="text-sm text-zinc-500 mt-1">
              Valor com desconto:{" "}
              <strong>R$ {valorComDesconto.toFixed(2)}</strong>
            </p>
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
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
