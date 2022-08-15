/*
  Warnings:

  - The values [segurops_unimed] on the enum `enum_insurances` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "enum_insurances_new" AS ENUM ('allianz_saude', 'ameplan_saude', 'amil_facil', 'amil_saude', 'ativia', 'biosaude', 'biovida_saude', 'blue_med_saude', 'bradesco_saude', 'classes_laboriosas', 'cuidar_me', 'cruz_azul_saue', 'gs_saude', 'golden_cross', 'hapvida', 'health_santaris', 'interclinicas_saude', 'kipp_saude', 'medical_health', 'medsenior', 'med_tour_saude', 'notre_dame_intermedica', 'plansaude', 'plena_saude', 'porto_seguro_saude', 'prevent_senior', 'qsaude', 'santa_helena_saude', 'sao_cristovao_saude', 'sao_miguel_saude', 'seguros_unimed', 'sompo_saude', 'sul_america_saude', 'total_medcare_saude', 'trasmontano_saude', 'unihosp_saude', 'unimed_nacional');
ALTER TABLE "patients" ALTER COLUMN "insurance" TYPE "enum_insurances_new" USING ("insurance"::text::"enum_insurances_new");
ALTER TYPE "enum_insurances" RENAME TO "enum_insurances_old";
ALTER TYPE "enum_insurances_new" RENAME TO "enum_insurances";
DROP TYPE "enum_insurances_old";
COMMIT;
