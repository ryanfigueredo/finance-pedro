import { PrismaClient } from "@prisma/client";

declare global {
  // Evita recriar o PrismaClient a cada hot-reload
  // no ambiente de desenvolvimento
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // pode remover isso em produção
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
