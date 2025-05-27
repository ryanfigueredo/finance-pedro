"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { KpiCard } from "@/components/dashboard/KpiCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BadgeDollarSign,
  FileText,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default async function Dashboard() {
  const movimentacoes = [
    {
      dataPrevista: "2024-05-01",
      dataPagamento: "2024-05-01",
      tipo: "Envio de duplicata para Fulano S/A",
      valor: 9238,
      status: "Confirmado",
    },
    {
      dataPrevista: "2024-05-02",
      dataPagamento: "2024-05-02",
      tipo: "Recebimento antecipado - Sicredi",
      valor: -10000,
      status: "Confirmado",
    },
    {
      dataPrevista: "2024-05-03",
      tipo: "Envio de duplicata para Beltrano Ltda",
      valor: -1500,
      status: "Pendente",
    },
    {
      dataPrevista: "2024-05-04",
      tipo: "Receita por antecipação - BMG",
      valor: 3246,
      status: "Pendente",
    },
    {
      dataPrevista: "2024-05-05",
      tipo: "Envio de duplicata para MEI João",
      valor: -800,
      status: "Pendente",
    },
    {
      dataPrevista: "2024-05-06",
      tipo: "Pagamento autorizado - Bradesco",
      valor: 5336,
      status: "Pendente",
    },
    {
      dataPrevista: "2024-05-07",
      tipo: "Envio de duplicata para Cliente Z",
      valor: 3827,
      status: "Pendente",
    },
  ];

  const atrasos = [
    {
      dataPrevista: "2024-05-01",
      tipo: "Recebimento pendente - Cliente X",
      valor: -1500,
    },
    {
      dataPrevista: "2024-05-02",
      tipo: "Envio vencido - Cliente Y",
      valor: -1000,
    },
  ];

  const previstos = [
    {
      dataPrevista: "2024-05-03",
      tipo: "Envio agendado - Cliente A",
      valor: -1500,
    },
    {
      dataPrevista: "2024-05-04",
      tipo: "Pagamento programado - Itaú",
      valor: -3000,
    },
    {
      dataPrevista: "2024-05-05",
      tipo: "Crédito previsto - Santander",
      valor: -1000,
    },
    { dataPrevista: "2024-05-06", tipo: "Recebimento via boleto", valor: 5336 },
  ];

  const entradas = movimentacoes
    .filter((m) => m.valor > 0)
    .reduce((acc, m) => acc + m.valor, 0);
  const saidas = movimentacoes
    .filter((m) => m.valor < 0)
    .reduce((acc, m) => acc + m.valor, 0);
  const saldo = entradas + saidas;

  const [total, vencidas, pagas, pendentes] = await Promise.all([
    prisma.duplicata.count(),
    prisma.duplicata.count({
      where: { vencimento: { lt: new Date() }, status: "PENDENTE" },
    }),
    prisma.duplicata.count({ where: { status: "PAGA" } }),
    prisma.duplicata.count({ where: { status: "PENDENTE" } }),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-max gap-4">
      {/* Linha 1 - Entradas, Saídas, Saldo */}
      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-6">
          <p className="text-sm">Entradas</p>
          <p className="text-2xl font-bold">
            R$ {entradas.toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-6">
          <p className="text-sm">Saídas</p>
          <p className="text-2xl font-bold">
            R$ {saidas.toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-6">
          <p className="text-sm">Saldo</p>
          <p className="text-2xl font-bold">
            R$ {saldo.toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      {/* Relatório - ocupa 2 colunas e 2 linhas */}
      <div className="lg:col-span-2 lg:row-span-2">
        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              Histórico de operações
            </h2>
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th>Data Prevista</th>
                  <th>Data Efetiva</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((m, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td>{format(new Date(m.dataPrevista), "dd/MM/yyyy")}</td>
                    <td>
                      {m.dataPagamento
                        ? format(new Date(m.dataPagamento), "dd/MM/yyyy")
                        : "-"}
                    </td>
                    <td>{m.tipo}</td>
                    <td>R$ {m.valor.toLocaleString("pt-BR")}</td>
                    <td>
                      <Badge
                        variant="outline"
                        className={
                          m.status === "Confirmado"
                            ? "border-green-500 text-green-600"
                            : "border-yellow-400 text-yellow-600"
                        }
                      >
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Previsto */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-base font-semibold mb-2">
              Previstos (15 dias)
            </h2>
            <ul className="text-sm space-y-1">
              {previstos.map((p, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span
                    className="truncate overflow-hidden text-ellipsis max-w-[200px]"
                    title={`${format(
                      new Date(p.dataPrevista),
                      "dd/MM/yyyy"
                    )} - ${p.tipo}`}
                  >
                    {format(new Date(p.dataPrevista), "dd/MM/yyyy")} - {p.tipo}
                  </span>
                  <span
                    className={`text-end w-24 whitespace-nowrap ${
                      p.valor < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    R$ {p.valor.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Atraso */}
      <div className="lg:col-span-1">
        <Card className="">
          <CardContent className="p-4">
            <h2 className="text-base font-semibold mb-2 ">
              Pagamentos em atraso
            </h2>
            <ul className="text-sm  space-y-1">
              {atrasos.map((a, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span
                    className="truncate overflow-hidden text-ellipsis max-w-[200px]"
                    title={`${format(
                      new Date(a.dataPrevista),
                      "dd/MM/yyyy"
                    )} - ${a.tipo}`}
                  >
                    {format(new Date(a.dataPrevista), "dd/MM/yyyy")} - {a.tipo}
                  </span>
                  <span className="text-right  text-red-700 w-24 whitespace-nowrap">
                    R$ {a.valor.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
              <li className="flex justify-between font-bold mt-2 border-t pt-1">
                <span>Total</span>
                <span>
                  R${" "}
                  {atrasos
                    .reduce((acc, a) => acc + a.valor, 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4 w-full">
        <Link href="/duplicatas">
          <KpiCard title="Duplicatas Digitadas" value={total.toString()} />
        </Link>

        <Link href="/duplicatas?status=PENDENTE">
          <KpiCard title="Pendentes" value={pendentes.toString()} />
        </Link>

        <Link href="/duplicatas?status=PAGA">
          <KpiCard title="Liquidadas" value={pagas.toString()} />
        </Link>

        <Link href="/duplicatas?status=VENCIDA">
          <KpiCard title="Vencidas" value={vencidas.toString()} />
        </Link>

        <Link href="/borderos">
          <KpiCard title="Borderôs Gerados" value="↗" />
        </Link>
      </div>
    </div>
  );
}
