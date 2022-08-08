/*
  Warnings:

  - You are about to drop the column `code` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `registries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `registries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `registries` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "patients_code_key";

-- DropIndex
DROP INDEX "registries_cpf_key";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "code",
ADD COLUMN     "cpf" VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE "registries" DROP COLUMN "cpf",
ADD COLUMN     "code" VARCHAR(8) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "registries_code_key" ON "registries"("code");
