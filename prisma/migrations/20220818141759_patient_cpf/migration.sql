/*
  Warnings:

  - You are about to drop the column `cpf` on the `registries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "registries_cpf_key";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "cpf" VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE "registries" DROP COLUMN "cpf";

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");
