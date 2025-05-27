"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Cliente {
  id: string;
  nome: string;
}

export default function NovaDuplicataDialog() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [numero, setNumero] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [valor, setValor] = useState(10000);
  const [desconto, setDesconto] = useState(0);
  const [vencimento, setVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const valorComDesconto = valor - valor * (desconto / 100);

  useEffect(() => {
    async function fetchClientes() {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    }
    fetchClientes();
  }, []);

  const handleSubmit = async () => {
    alert("RODANDO!");
    const payload = {
      numero,
      valor,
      valorComDesconto,
      vencimento,
      observacoes,
      clienteId,
      userId: "517a08fe-9c36-43b2-b8a9-3009142c1f1d", // ✅ ID real criado
    };

    console.log("✅ Payload enviado:", payload);

    try {
      const res = await fetch("/api/duplicatas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("📥 Resposta crua do backend:", text);

      let result = null;
      try {
        result = JSON.parse(text);
        console.log("📦 JSON interpretado:", result);
      } catch (e) {
        console.error("❌ JSON inválido:", e);
      }

      if (!res.ok) {
        const mensagem =
          result?.issues?.length > 0
            ? result.issues
                .map((i: any) => `• ${i.path[0]}: ${i.message}`)
                .join("\n")
            : result?.error ?? "Erro desconhecido";

        alert("Erro ao emitir duplicata:\n" + mensagem);
        return;
      }

      alert("✅ Duplicata emitida com sucesso!");
      window.location.reload();
    } catch (err) {
      console.error("❌ Erro de rede:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Nova Duplicata</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Número da duplicata</Label>
          <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
        </div>

        <div>
          <Label>Cliente</Label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
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
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Emitir Duplicata
        </Button>
      </div>
    </div>
  );
}
