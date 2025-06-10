/*
  Warnings:

  - A unique constraint covering the columns `[numeroPublico]` on the table `Duplicata` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Duplicata" ADD COLUMN     "numeroPublico" TEXT,
ADD COLUMN     "sacadoCpfCnpj" TEXT NOT NULL DEFAULT '00000000000',
ADD COLUMN     "sacadoNome" TEXT NOT NULL DEFAULT 'NOME TEMP';

-- CreateIndex
CREATE UNIQUE INDEX "Duplicata_numeroPublico_key" ON "Duplicata"("numeroPublico");
