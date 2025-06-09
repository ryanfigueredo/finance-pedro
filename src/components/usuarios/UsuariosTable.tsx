"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UsuarioDialog } from "./UsuarioDialog";
import { ExcluirUsuarioButton } from "./ExcluirUsuarioButton";

type Usuario = {
  id: string;
  name: string;
  email: string;
  role: "MASTER" | "ADMIN" | "CLIENTE";
};

export function UsuariosTable() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then(setUsuarios);
  }, []);

  const filtrados = usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white shadow-md rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">Usuários</h2>
        <UsuarioDialog />
      </div>

      <Input
        placeholder="Buscar por nome ou email"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-4"
      />

      <table className="w-full text-sm">
        <thead className="text-zinc-500 border-b">
          <tr>
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Cargo</th>
            <th className="text-left p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((u) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <Badge variant="outline">{u.role}</Badge>
              </td>
              <td className="p-2 space-x-2">
                <UsuarioDialog usuario={u} />
                <ExcluirUsuarioButton usuarioId={u.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
