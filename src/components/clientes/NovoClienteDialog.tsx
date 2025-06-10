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

export function NovoClienteDialog() {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [inscEstadual, setInscEstadual] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [taxaAntecipacao, setTaxaAntecipacao] = useState(0);
  const [taxaBancaria, setTaxaBancaria] = useState(0);
  const [taxaServico, setTaxaServico] = useState(0);
  const [negativado, setNegativado] = useState(false);
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
      alert("CPF ou CNPJ inválido ❌");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        cpfCnpj,
        inscEstadual,
        email,
        telefone,
        endereco,
        taxaAntecipacao,
        taxaBancaria,
        taxaServico,
        negativado,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Cliente cadastrado com sucesso ✅");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Erro: ${data.error}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Novo Cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
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
            <Label>Inscrição Estadual</Label>
            <Input
              value={inscEstadual}
              maxLength={18}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setInscEstadual(onlyNumbers);
              }}
              placeholder="Opcional"
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
              id="negativado"
              checked={negativado}
              onChange={() => setNegativado(!negativado)}
            />
            <Label htmlFor="negativado">Cliente negativado?</Label>
          </div>

          <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
