-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "taxaAdicional" DOUBLE PRECISION DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Duplicata" ADD COLUMN     "borderoId" TEXT,
ADD COLUMN     "resultado" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Bordero" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "dataGeracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorBruto" DOUBLE PRECISION NOT NULL,
    "totalTaxas" DOUBLE PRECISION NOT NULL,
    "valorLiquido" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bordero_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Duplicata" ADD CONSTRAINT "Duplicata_borderoId_fkey" FOREIGN KEY ("borderoId") REFERENCES "Bordero"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bordero" ADD CONSTRAINT "Bordero_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
