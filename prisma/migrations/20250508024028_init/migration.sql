-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENTE', 'ADMIN', 'MASTER');

-- CreateEnum
CREATE TYPE "StatusDuplicata" AS ENUM ('PENDENTE', 'PAGA', 'ANTECIPADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "razaoSocial" TEXT,
    "taxaAntecipacao" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxaBancaria" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxaServico" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxaNegativacao" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Duplicata" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorComDesconto" DOUBLE PRECISION,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "emissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusDuplicata" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "userId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Duplicata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arquivo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "duplicataId" TEXT NOT NULL,

    CONSTRAINT "Arquivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultaCredito" (
    "id" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "aprovado" BOOLEAN NOT NULL,
    "valorSimulado" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultaCredito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antecipacao" (
    "id" TEXT NOT NULL,
    "duplicataId" TEXT NOT NULL,
    "taxaAplicada" DOUBLE PRECISION NOT NULL,
    "valorFinal" DOUBLE PRECISION NOT NULL,
    "dataSolicitada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Antecipacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpfCnpj_key" ON "Cliente"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Duplicata_numero_key" ON "Duplicata"("numero");

-- AddForeignKey
ALTER TABLE "Duplicata" ADD CONSTRAINT "Duplicata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duplicata" ADD CONSTRAINT "Duplicata_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arquivo" ADD CONSTRAINT "Arquivo_duplicataId_fkey" FOREIGN KEY ("duplicataId") REFERENCES "Duplicata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antecipacao" ADD CONSTRAINT "Antecipacao_duplicataId_fkey" FOREIGN KEY ("duplicataId") REFERENCES "Duplicata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
