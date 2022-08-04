/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `registries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `registries` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `insurance` on the `patients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "complement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "insurance",
ADD COLUMN     "insurance" "enum_insurances" NOT NULL,
ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "registries" ALTER COLUMN "household_number" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patients_code_key" ON "patients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "registries_rg_key" ON "registries"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "registries_cpf_key" ON "registries"("cpf");
