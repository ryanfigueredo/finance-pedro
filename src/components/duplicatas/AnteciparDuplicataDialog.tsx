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
  const [detalhes, setDetalhes] = useState<any>(null);

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

      setDetalhes({
        dias,
        taxaAntecipacao: cliente.taxaAntecipacao,
        taxaServico: cliente.taxaServico,
        taxaBancaria: cliente.taxaBancaria,
        taxaAdicional: cliente.taxaAdicional,
        taxaComposta: taxaComposta * 100,
        totalTaxasPercentuais: totalTaxasPercentuais * 100,
        totalTaxasFixas,
      });
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

        {valorFinal !== null && detalhes ? (
          <div className="text-sm text-zinc-700 space-y-2">
            <p>
              <strong>Valor original:</strong> R$ {valor.toFixed(2)}
            </p>
            <p>
              <strong>Dias até vencimento:</strong> {detalhes.dias} dias
            </p>
            <p>
              <strong>Taxa composta aplicada:</strong>{" "}
              {detalhes.taxaComposta.toFixed(2)}%
            </p>
            <p>
              <strong>Taxa de Serviço (R$):</strong> R${" "}
              {(detalhes.taxaServico ?? 0).toFixed(2)}
            </p>
            <p>
              <strong>Taxa Bancária (R$):</strong> R${" "}
              {(detalhes.taxaBancaria ?? 0).toFixed(2)}
            </p>
            <p>
              <strong>Taxa Adicional (R$):</strong> R${" "}
              {(detalhes.taxaAdicional ?? 0).toFixed(2)}
            </p>

            <p>
              <strong>Total descontado:</strong>{" "}
              {(valor - valorFinal).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
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
