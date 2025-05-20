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
import {
  isValidCPF,
  isValidCNPJ,
  formatCPF,
  formatCNPJ,
} from "@brazilian-utils/brazilian-utils";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  negativado: boolean;
};

export function ClienteDialog({ cliente }: { cliente?: Cliente }) {
  const isEditando = !!cliente;

  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [cpfCnpj, setCpfCnpj] = useState(cliente?.cpfCnpj ?? "");
  const [email, setEmail] = useState(cliente?.email ?? "");
  const [telefone, setTelefone] = useState(cliente?.telefone ?? "");
  const [endereco, setEndereco] = useState(cliente?.endereco ?? "");
  const [taxaAntecipacao, setTaxaAntecipacao] = useState(
    cliente?.taxaAntecipacao ?? 0
  );
  const [taxaBancaria, setTaxaBancaria] = useState(cliente?.taxaBancaria ?? 0);
  const [taxaServico, setTaxaServico] = useState(cliente?.taxaServico ?? 0);
  const [negativado, setNegativado] = useState(cliente?.negativado ?? false);
  const [loading, setLoading] = useState(false);

  function handleCpfCnpjChange(value: string) {
    const raw = value.replace(/\D/g, "").slice(0, 14);
    let formatted = raw;
    formatted = raw.length <= 11 ? formatCPF(raw) : formatCNPJ(raw);
    setCpfCnpj(formatted);
  }

  async function handleSubmit() {
    setLoading(true);

    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
    if (!isValidCPF(cleanCpfCnpj) && !isValidCNPJ(cleanCpfCnpj)) {
      toast.error("CPF ou CNPJ inválido ❌");
      setLoading(false);
      return;
    }

    const body = {
      nome,
      cpfCnpj,
      email,
      telefone,
      endereco,
      taxaAntecipacao,
      taxaBancaria,
      taxaServico,
      negativado,
    };

    const res = await fetch(
      isEditando ? `/api/clientes/${cliente?.id}` : "/api/clientes",
      {
        method: isEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      toast.success(
        isEditando
          ? "Cliente atualizado com sucesso ✅"
          : "Cliente cadastrado com sucesso ✅"
      );
      window.location.reload();
    } else {
      const data = await res.json();
      toast.error(`Erro: ${data.error}`);
    }

    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isEditando ? "outline" : "default"}
          size={isEditando ? "sm" : "default"}
        >
          {isEditando ? "Editar" : "+ Novo Cliente"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditando ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Nome / Razão Social</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div>
            <Label>CPF/CNPJ</Label>
            <Input
              value={cpfCnpj}
              maxLength={18}
              onChange={(e) => handleCpfCnpjChange(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <Label>Telefone</Label>
            <Input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <Label>Endereço</Label>
            <Input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Taxa Antecipação (%)</Label>
              <Input
                type="number"
                value={taxaAntecipacao}
                onChange={(e) => setTaxaAntecipacao(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa Bancária (%)</Label>
              <Input
                type="number"
                value={taxaBancaria}
                onChange={(e) => setTaxaBancaria(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa Serviço (%)</Label>
              <Input
                type="number"
                value={taxaServico}
                onChange={(e) => setTaxaServico(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id={`negativado-${cliente?.id ?? "novo"}`}
              checked={negativado}
              onChange={() => setNegativado(!negativado)}
            />
            <Label htmlFor={`negativado-${cliente?.id ?? "novo"}`}>
              Cliente negativado?
            </Label>
          </div>

          <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : isEditando ? (
              "Salvar Alterações"
            ) : (
              "Salvar Cliente"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
