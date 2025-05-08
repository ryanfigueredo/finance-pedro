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

export function NovoClienteDialog() {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [taxa1, setTaxa1] = useState(0);
  const [taxa2, setTaxa2] = useState(0);
  const [taxa3, setTaxa3] = useState(0);
  const [negativado, setNegativado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/clientes", {
      method: "POST",
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
              onChange={(e) => setCpfCnpj(e.target.value)}
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
              <Label>Taxa 1</Label>
              <Input
                type="number"
                value={taxa1}
                onChange={(e) => setTaxa1(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa 2</Label>
              <Input
                type="number"
                value={taxa2}
                onChange={(e) => setTaxa2(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Taxa 3</Label>
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
