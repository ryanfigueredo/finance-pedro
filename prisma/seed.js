const { PrismaClient } = require("@prisma/client");
const { addDays } = require("date-fns");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando banco...");

  await prisma.antecipacao.deleteMany();
  await prisma.arquivo.deleteMany();
  await prisma.duplicata.deleteMany();
  await prisma.bordero.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔑 Gerando senhas...");

  const senhaHashCliente = await bcrypt.hash("123456", 10);
  const senhaHashMaster = await bcrypt.hash("admin123", 10);

  console.log("👤 Criando cliente e usuário...");

  const cliente = await prisma.cliente.create({
    data: {
      nome: "Comercial Sampaio",
      razaoSocial: "QUERO PARCELADO LTDA",
      cpfCnpj: "12345678000199",
      email: "pedro@comercialsampaio.com.br",
      telefone: "8899673123",
      endereco: "Rua João Paulo II, 217",
      taxaAntecipacao: 5,
      taxaBancaria: 3.5,
      taxaServico: 0,
      taxaAdicional: 0,
    },
  });

  const userCliente = await prisma.user.create({
    data: {
      name: "Pedro Sampaio",
      email: "pedro@comercialsampaio.com.br",
      password: senhaHashCliente,
      role: "CLIENTE",
    },
  });

  const userMaster = await prisma.user.create({
    data: {
      name: "Master Pedro",
      email: "master@financepedro.com",
      password: senhaHashMaster,
      role: "MASTER",
    },
  });

  console.log("📄 Criando duplicatas...");

  const duplicatas = Array.from({ length: 5 }, (_, i) => ({
    numero: `DUP-${i + 1}`,
    valor: 10000,
    vencimento: addDays(new Date(), i + 5),
    observacoes: `Duplicata teste ${i + 1}`,
    sacadoNome: `Sacado ${i + 1}`,
    sacadoCpfCnpj: `0000000000${i + 1}`,
    userId: userCliente.id,
    clienteId: cliente.id,
    status: "PENDENTE",
  }));

  for (const d of duplicatas) {
    await prisma.duplicata.create({ data: d });
  }

  console.log("✅ Seed finalizado com sucesso.");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
