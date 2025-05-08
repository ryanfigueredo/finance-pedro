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
  const [negativado, setNegativado] = useState(false);

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
            <Input />
          </div>

          <div>
            <Label>CPF/CNPJ</Label>
            <Input />
          </div>

          <div>
            <Label>Email</Label>
            <Input />
          </div>

          <div>
            <Label>Telefone</Label>
            <Input />
          </div>

          <div>
            <Label>Endereço</Label>
            <Input />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Taxa 1</Label>
              <Input placeholder="%" type="number" />
            </div>
            <div>
              <Label>Taxa 2</Label>
              <Input placeholder="%" type="number" />
            </div>
            <div>
              <Label>Taxa 3</Label>
              <Input placeholder="%" type="number" />
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

          <Button className="mt-2">Salvar Cliente</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
