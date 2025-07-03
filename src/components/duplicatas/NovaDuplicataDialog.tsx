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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NovaDuplicataDialog() {
  const [numero, setNumero] = useState("");
  const [valor, setValor] = useState(10000);
  const [vencimento, setVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [sacadoNome, setSacadoNome] = useState("");
  const [sacadoCpfCnpj, setSacadoCpfCnpj] = useState("");
  const [loading, setLoading] = useState(false);

  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [resultado, setResultado] = useState<number | null>(null);

  const { data: session } = useSession();

  async function fetchProximoNumero() {
    try {
      const res = await fetch("/api/duplicatas/proximo-numero");
      const data = await res.json();
      setNumero(data.proximoNumero);
    } catch (err) {
      console.error("Erro ao gerar número da duplicata:", err);
    }
  }

  async function handleSubmit() {
    setLoading(true);

    if (!clienteId || !valor || !vencimento || !sacadoNome || !sacadoCpfCnpj) {
      alert("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }
    if (!session?.user?.id) {
      alert("Erro: sessão inválida. Refaça o login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/duplicatas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor,
          vencimento,
          observacoes,
          clienteId,
          sacadoNome,
          sacadoCpfCnpj,
          userId: session?.user?.id ?? "",
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
    fetchProximoNumero();
  }, []);

  useEffect(() => {
    if (!clienteSelecionado || !valor || !vencimento) {
      setResultado(null);
      return;
    }

    const venc = new Date(vencimento);
    const hoje = new Date();

    const msPorDia = 1000 * 60 * 60 * 24;
    const diffMs = venc.getTime() - hoje.getTime();
    const dias = Math.max(0, Math.floor(diffMs / msPorDia));

    const taxaAntecipacao = clienteSelecionado.taxaAntecipacao ?? 0;
    const taxaServico = clienteSelecionado.taxaServico ?? 0;
    const taxaBancaria = clienteSelecionado.taxaBancaria ?? 0;
    const taxaAdicional = clienteSelecionado.taxaAdicional ?? 0;

    const taxaAntecipacaoPorDia = taxaAntecipacao / 30 / 100;
    const descontoAntecipacao = valor * taxaAntecipacaoPorDia * dias;
    const descontoServico = valor * (taxaServico / 100);
    const descontoFixos = taxaBancaria + taxaAdicional;

    const totalDescontado =
      descontoAntecipacao + descontoServico + descontoFixos;
    const resultadoFinal = valor - totalDescontado;

    setResultado(Number(resultadoFinal.toFixed(2)));
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
          {numero && (
            <div>
              <Label>Número</Label>
              <Input value={numero} disabled />
            </div>
          )}

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
            <Label>Nome do Sacado</Label>
            <Input
              placeholder="Nome completo ou empresa"
              value={sacadoNome}
              onChange={(e) => setSacadoNome(e.target.value)}
            />
          </div>

          <div>
            <Label>CPF ou CNPJ do Sacado</Label>
            <Input
              placeholder="Somente números"
              value={sacadoCpfCnpj}
              onChange={(e) =>
                setSacadoCpfCnpj(e.target.value.replace(/\D/g, ""))
              }
              maxLength={18}
            />
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
            {resultado !== null && clienteSelecionado && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-green-600 mt-1 cursor-help">
                      Saldo para antecipação:{" "}
                      <strong>R$ {resultado.toLocaleString("pt-BR")}</strong>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">
                    <p>
                      <strong>Base:</strong> R$ {valor.toLocaleString("pt-BR")}
                    </p>
                    <p>
                      <strong>
                        Antecipação ({clienteSelecionado.taxaAntecipacao}%):
                      </strong>{" "}
                      {(
                        valor *
                        (clienteSelecionado.taxaAntecipacao / 30 / 100)
                      ).toFixed(2)}{" "}
                      por dia ×{" "}
                      {Math.max(
                        0,
                        Math.floor(
                          (new Date(vencimento).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      dias
                    </p>
                    <p>
                      <strong>
                        Serviço ({clienteSelecionado.taxaServico}%):
                      </strong>{" "}
                      R${" "}
                      {(valor * (clienteSelecionado.taxaServico / 100)).toFixed(
                        2
                      )}
                    </p>
                    <p>
                      <strong>Bancária:</strong> R${" "}
                      {Number(clienteSelecionado.taxaBancaria).toFixed(2)}
                    </p>
                    <p>
                      <strong>Adicional:</strong> R${" "}
                      {Number(clienteSelecionado.taxaAdicional).toFixed(2)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
