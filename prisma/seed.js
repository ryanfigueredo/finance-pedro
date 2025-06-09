// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "master@financepedro.com" },
    update: {},
    create: {
      name: "Master Pedro",
      email: "master@financepedro.com",
      password,
      role: "MASTER",
    },
  });

  console.log("✅ Usuário criado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
