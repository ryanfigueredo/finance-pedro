"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DollarSign } from "lucide-react";

type Antecipacao = {
  id: string;
  taxaAplicada: number;
  valorFinal: number;
  dataSolicitada: string;
  duplicata: {
    numero: string;
    valor: number;
  };
};

export default function AntecipacoesPage() {
  const [antecipacoes, setAntecipacoes] = useState<Antecipacao[]>([]);

  useEffect(() => {
    fetch("/api/antecipacoes")
      .then((res) => res.json())
      .then((data) => setAntecipacoes(data))
      .catch((err) => console.error("Erro ao buscar antecipações:", err));
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        Antecipações Realizadas
      </h1>
      <p className="text-sm text-muted-foreground -mt-4">
        Visualize as duplicatas antecipadas e os valores recebidos.
      </p>

      {antecipacoes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma antecipação encontrada.
        </p>
      ) : (
        antecipacoes.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-medium text-zinc-800 dark:text-zinc-100">
                  Duplicata {a.duplicata.numero} -{" "}
                  {format(new Date(a.dataSolicitada), "dd/MM/yyyy")}
                </span>
                <Badge variant="outline" className="text-xs">
                  Taxa aplicada: {(a.taxaAplicada * 100).toFixed(2)}%
                </Badge>
              </div>

              <div className="flex justify-between text-sm flex-wrap gap-2">
                <span className="text-muted-foreground">
                  Valor original:{" "}
                  <strong>
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(a.duplicata.valor)}
                  </strong>
                </span>
                <span className="text-green-600 font-semibold">
                  Valor recebido:{" "}
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(a.valorFinal)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
