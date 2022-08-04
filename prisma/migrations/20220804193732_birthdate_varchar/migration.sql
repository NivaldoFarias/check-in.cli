/*
  Warnings:

  - Changed the type of `birthdate` on the `patients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "birthdate",
ADD COLUMN     "birthdate" VARCHAR(10) NOT NULL;
