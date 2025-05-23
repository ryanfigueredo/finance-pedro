// src/components/dashboard/RelatorioAtrasos.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface Atraso {
  dataPrevista: string;
  tipo: string;
  valor: number;
}

interface Props {
  atrasos: Atraso[];
}

export function RelatorioAtrasos({ atrasos }: Props) {
  const total = atrasos.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <Card className="bg-red-100">
      <CardContent className="p-4">
        <h2 className="text-base font-semibold mb-2 text-red-800">
          Pagamentos em atraso
        </h2>
        <ul className="text-sm text-red-700 space-y-1">
          {atrasos.map((a, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {format(new Date(a.dataPrevista), "dd/MM/yyyy")} - {a.tipo}
              </span>
              <span>R$ {a.valor.toLocaleString("pt-BR")}</span>
            </li>
          ))}
          <li className="flex justify-between font-bold mt-2 border-t pt-1">
            <span>Total</span>
            <span>R$ {total.toLocaleString("pt-BR")}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
