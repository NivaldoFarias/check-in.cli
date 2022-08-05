/*
  Warnings:

  - You are about to drop the column `createdAt` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `practitioners` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "practitioners" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
