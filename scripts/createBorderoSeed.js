const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const cliente = await prisma.cliente.create({
    data: {
      nome: "Cliente de Teste",
      cpfCnpj: `${Date.now()}`, // CPF fake único com timestamp
      taxaAntecipacao: 4.5,
      taxaBancaria: 1.2,
      taxaServico: 0.8,
      taxaNegativacao: 3.5,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Usuário Teste",
      email: `teste${Date.now()}@exemplo.com`,
      password: "123456",
    },
  });

  const duplicatas = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.duplicata.create({
        data: {
          numero: `000${i + 1}`,
          valor: 1000 + i * 100,
          vencimento: new Date(Date.now() + (i + 5) * 86400000),
          status: "PENDENTE",
          clienteId: cliente.id,
          userId: user.id,
        },
      })
    )
  );

  const valorBruto = duplicatas.reduce((acc, d) => acc + d.valor, 0);
  const totalTaxas = duplicatas.reduce(
    (acc, d) =>
      acc +
      d.valor *
        ((cliente.taxaAntecipacao +
          cliente.taxaBancaria +
          cliente.taxaServico +
          (cliente.taxaNegativacao ?? 0)) /
          100),
    0
  );
  const valorLiquido = valorBruto - totalTaxas;

  const bordero = await prisma.bordero.create({
    data: {
      clienteId: cliente.id,
      valorBruto,
      totalTaxas,
      valorLiquido,
      duplicatas: {
        connect: duplicatas.map((d) => ({ id: d.id })),
      },
    },
  });

  await prisma.duplicata.updateMany({
    where: { id: { in: duplicatas.map((d) => d.id) } },
    data: { status: "ANTECIPADA", borderoId: bordero.id },
  });

  console.log("✅ Borderô criado com sucesso!");
  console.log("ID do Borderô:", bordero.id);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
