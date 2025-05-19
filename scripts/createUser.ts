import { prisma } from "@/lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Ryan",
      email: "ryan@teste.com",
      password: "senha123",
      role: "CLIENTE",
    },
  });

  console.log("✅ Usuário criado com sucesso:");
  console.log("🆔 ID:", user.id);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao criar usuário:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
