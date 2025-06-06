"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Props {
  numero: string;
  valor: number;
  taxa: number;
  duplicataId: string;
}

export function AnteciparDuplicataDialog({
  numero,
  valor,
  taxa,
  duplicataId,
}: Props) {
  const [valorFinal, setValorFinal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function calcularValorFinal() {
    try {
      const res = await fetch(`/api/duplicatas/${duplicataId}`);
      const duplicata = await res.json();

      const cliente = duplicata.cliente;
      const vencimento = new Date(duplicata.vencimento);
      const hoje = new Date();
      const dias = Math.max(
        1,
        Math.ceil(
          (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const taxaComposta =
        Math.pow(1 + (cliente.taxaAntecipacao ?? 0) / 100, dias) - 1;
      const totalTaxasPercentuais =
        taxaComposta + (cliente.taxaServico ?? 0) / 100;
      const totalTaxasFixas =
        (cliente.taxaAdicional ?? 0) + (cliente.taxaBancaria ?? 0);

      const resultado =
        valor - (valor * totalTaxasPercentuais + totalTaxasFixas);
      setValorFinal(Number(resultado.toFixed(2)));
    } catch (err) {
      console.error("Erro ao calcular valor final:", err);
      setValorFinal(null);
    }
  }

  useEffect(() => {
    calcularValorFinal();
  }, []);

  async function handleAntecipar() {
    if (valorFinal === null) return;
    setLoading(true);
    const res = await fetch("/api/antecipacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duplicataId,
        taxa,
        valorFinal,
      }),
    });

    setLoading(false);
    if (res.ok) {
      alert("Antecipação registrada com sucesso ✅");
      window.location.reload();
    } else {
      alert("Erro ao antecipar duplicata");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Antecipar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antecipar Duplicata #{numero}</DialogTitle>
        </DialogHeader>

        {valorFinal !== null ? (
          <div className="text-sm text-zinc-700 space-y-2">
            <p>
              <strong>Valor original:</strong> R$ {valor.toFixed(2)}
            </p>
            <p>
              <strong>Taxa de antecipação:</strong> {(taxa * 100).toFixed(1)}%
            </p>
            <p>
              <strong>Valor final a receber:</strong>{" "}
              <span className="text-green-600 font-semibold">
                R$ {valorFinal.toLocaleString("pt-BR")}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Calculando valor final...</p>
        )}

        <DialogFooter>
          <Button
            onClick={handleAntecipar}
            disabled={loading || valorFinal === null}
          >
            {loading ? "Enviando..." : "Confirmar antecipação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
