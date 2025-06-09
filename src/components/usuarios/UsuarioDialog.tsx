"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: "MASTER" | "ADMIN" | "CLIENTE";
}

export function UsuarioDialog({ usuario }: { usuario?: Usuario }) {
  const [nome, setNome] = useState(usuario?.name ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<Usuario["role"]>(usuario?.role ?? "CLIENTE");
  const [loading, setLoading] = useState(false);
  const isEditando = !!usuario;

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch(
      isEditando ? `/api/usuarios/${usuario?.id}` : "/api/usuarios",
      {
        method: isEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, email, password: senha, role }),
      }
    );

    if (res.ok) {
      toast.success(isEditando ? "Usuário atualizado ✅" : "Usuário criado ✅");
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
          {isEditando ? "Editar" : "+ Novo Usuário"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditando ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div>
            <Label>Cargo</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Usuario["role"])}
              className="w-full border rounded px-3 py-2"
            >
              <option value="MASTER">Master</option>
              <option value="ADMIN">Admin</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Salvando..."
              : isEditando
              ? "Salvar Alterações"
              : "Salvar Usuário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
