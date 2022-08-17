/*
  Warnings:

  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `social_name` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `household_number` on the `registries` table. All the data in the column will be lost.
  - You are about to drop the column `personal_number` on the `registries` table. All the data in the column will be lost.
  - You are about to drop the column `rg` on the `registries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `registries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `registries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `registries` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "patients_cpf_key";

-- DropIndex
DROP INDEX "registries_rg_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "country";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "cpf",
DROP COLUMN "social_name",
ADD COLUMN     "first_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "registries" DROP COLUMN "household_number",
DROP COLUMN "personal_number",
DROP COLUMN "rg",
ADD COLUMN     "cpf" VARCHAR(11) NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "registries_cpf_key" ON "registries"("cpf");
