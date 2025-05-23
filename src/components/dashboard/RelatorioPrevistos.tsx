// src/components/dashboard/RelatorioPrevistos.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface Previsto {
  dataPrevista: string;
  tipo: string;
  valor: number;
}

interface Props {
  previstos: Previsto[];
}

export function RelatorioPrevistos({ previstos }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-base font-semibold mb-2">Previsto (15 dias)</h2>
        <ul className="text-sm space-y-1">
          {previstos.map((p, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {format(new Date(p.dataPrevista), "dd/MM/yyyy")} - {p.tipo}
              </span>
              <span className={p.valor < 0 ? "text-red-600" : "text-green-600"}>
                R$ {p.valor.toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
