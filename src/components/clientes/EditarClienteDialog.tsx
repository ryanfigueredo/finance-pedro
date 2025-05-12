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
import { useState } from "react";
import {
  isValidCPF,
  isValidCNPJ,
  formatCPF,
  formatCNPJ,
} from "@brazilian-utils/brazilian-utils";

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

export function EditarClienteDialog({ cliente }: { cliente: Cliente }) {
  const [nome, setNome] = useState(cliente.nome);
  const [cpfCnpj, setCpfCnpj] = useState(cliente.cpfCnpj);
  const [email, setEmail] = useState(cliente.email || "");
  const [telefone, setTelefone] = useState(cliente.telefone || "");
  const [endereco, setEndereco] = useState(cliente.endereco || "");
  const [taxa1, setTaxa1] = useState(cliente.taxaAntecipacao);
  const [taxa2, setTaxa2] = useState(cliente.taxaBancaria);
  const [taxa3, setTaxa3] = useState(cliente.taxaServico);
  const [negativado, setNegativado] = useState(cliente.negativado);
  const [loading, setLoading] = useState(false);

  function handleCpfCnpjChange(value: string) {
    const raw = value.replace(/\D/g, "").slice(0, 14);
    let formatted = raw;

    if (raw.length <= 11) {
      formatted = formatCPF(raw);
    } else {
      formatted = formatCNPJ(raw);
    }

    setCpfCnpj(formatted);
  }

  async function handleSubmit() {
    setLoading(true);

    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
    if (!isValidCPF(cleanCpfCnpj) && !isValidCNPJ(cleanCpfCnpj)) {
      alert("CPF ou CNPJ inválido ❌");
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/clientes/${cliente.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        cpfCnpj,
        email,
        telefone,
        endereco,
        taxaAntecipacao: taxa1,
        taxaBancaria: taxa2,
        taxaServico: taxa3,
        negativado,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Cliente atualizado com sucesso ✅");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Erro: ${data.error}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
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
                value={taxa1}
                onChange={(e) => setTaxa1(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa Bancária (%)</Label>
              <Input
                type="number"
                value={taxa2}
                onChange={(e) => setTaxa2(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa Serviço (%)</Label>
              <Input
                type="number"
                value={taxa3}
                onChange={(e) => setTaxa3(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id={`negativado-${cliente.id}`}
              checked={negativado}
              onChange={() => setNegativado(!negativado)}
            />
            <Label htmlFor={`negativado-${cliente.id}`}>
              Cliente negativado?
            </Label>
          </div>

          <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
