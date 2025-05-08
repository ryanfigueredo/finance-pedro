import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

type Status = "PENDENTE" | "PAGA" | "ANTECIPADA" | "CANCELADA";

interface Duplicata {
  numero: string;
  cliente: string;
  valor: number;
  status: Status;
  vencimento: Date;
}

const duplicatas: Duplicata[] = [
  {
    numero: "000123",
    cliente: "Maria Souza",
    valor: 5200,
    status: "PENDENTE",
    vencimento: new Date(),
  },
  {
    numero: "000124",
    cliente: "João Ferreira",
    valor: 9900,
    status: "PAGA",
    vencimento: new Date(),
  },
];

export function DuplicataTable() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">
        Duplicatas Emitidas
      </h2>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 border-b">
            <tr>
              <th className="text-left p-2">Número</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Valor</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {duplicatas.map((d) => (
              <tr key={d.numero} className="border-b last:border-none">
                <td className="p-2">{d.numero}</td>
                <td className="p-2">{d.cliente}</td>
                <td className="p-2">R$ {d.valor.toLocaleString("pt-BR")}</td>
                <td className="p-2">
                  <Badge variant="outline" className={getBadgeColor(d.status)}>
                    {d.status}
                  </Badge>
                </td>
                <td className="p-2">
                  {format(d.vencimento, "dd/MM/yyyy", { locale: ptBR })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getBadgeColor(status: Status) {
  switch (status) {
    case "PENDENTE":
      return "border-yellow-400 text-yellow-500";
    case "PAGA":
      return "border-green-400 text-green-600";
    case "ANTECIPADA":
      return "border-blue-400 text-blue-600";
    case "CANCELADA":
      return "border-red-400 text-red-600";
  }
}
