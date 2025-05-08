type Cliente = {
  id: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  taxa1: number;
  taxa2: number;
  taxa3: number;
  negativado: boolean;
};

const clientes: Cliente[] = [
  {
    id: "1",
    nome: "Maria Souza",
    cpfCnpj: "123.456.789-00",
    email: "maria@email.com",
    telefone: "(11) 99999-0000",
    taxa1: 2.5,
    taxa2: 1.2,
    taxa3: 0.8,
    negativado: false,
  },
];

export function ClienteTable() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">Clientes</h2>
      <table className="w-full text-sm">
        <thead className="text-zinc-500 border-b">
          <tr>
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">CPF/CNPJ</th>
            <th className="text-left p-2">Taxa 1</th>
            <th className="text-left p-2">Negativado</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="border-b last:border-none">
              <td className="p-2">{c.nome}</td>
              <td className="p-2">{c.cpfCnpj}</td>
              <td className="p-2">{c.taxa1.toFixed(2)}%</td>
              <td className="p-2">{c.negativado ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
