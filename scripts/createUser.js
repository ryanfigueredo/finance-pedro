const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Usuário Mock",
      email: "mock@financepedro.com",
      password: "senhafake",
      role: "ADMIN", // ou "MASTER", dependendo do seu enum
    },
  });

  console.log("🆔 Usuário criado com sucesso:");
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
