/*
  Warnings:

  - Made the column `code` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "code" SET NOT NULL;
