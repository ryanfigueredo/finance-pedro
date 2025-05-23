// src/components/dashboard/RelatorioMovimentacoes.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const movimentacoes = [
  {
    dataPrevista: "2024-04-30",
    dataPagamento: "2024-04-30",
    tipo: "Envio de duplicata para Fulano S/A",
    valor: 9238,
    status: "Confirmado",
  },
  {
    dataPrevista: "2024-05-01",
    dataPagamento: "2024-05-01",
    tipo: "Recebimento antecipado - Sicredi",
    valor: -10000,
    status: "Confirmado",
  },
  {
    dataPrevista: "2024-05-02",
    tipo: "Envio de duplicata para Beltrano Ltda",
    valor: -1500,
    status: "Pendente",
  },
  {
    dataPrevista: "2024-05-03",
    tipo: "Receita por antecipação - BMG",
    valor: 3246,
    status: "Pendente",
  },
  {
    dataPrevista: "2024-05-04",
    tipo: "Envio de duplicata para MEI João",
    valor: -800,
    status: "Pendente",
  },
  {
    dataPrevista: "2024-05-05",
    tipo: "Pagamento autorizado - Bradesco",
    valor: 5336,
    status: "Pendente",
  },
  {
    dataPrevista: "2024-05-06",
    tipo: "Envio de duplicata para Cliente Z",
    valor: 3827,
    status: "Pendente",
  },
];

export function RelatorioMovimentacoes() {
  return (
    <Card className="xl:col-span-3">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Histórico de operações</h2>
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
  );
}
