-- CreateEnum
CREATE TYPE "enum_insurances" AS ENUM ('allianz_saude', 'ameplan_saude', 'amil_facil', 'amil_saude', 'ativia', 'biosaude', 'biovida_saude', 'blue_med_saude', 'bradesco_saude', 'classes_laboriosas', 'cuidar_me', 'cruz_azul_saue', 'gs_saude', 'golden_cross', 'hapvida', 'health_santaris', 'interclinicas_saude', 'kipp_saude', 'medical_health', 'medsenior', 'med_tour_saude', 'notre_dame_intermedica', 'plansaude', 'plena_saude', 'porto_seguro_saude', 'prevent_senior', 'qsaude', 'santa_helena_saude', 'sao_cristovao_saude', 'sao_miguel_saude', 'segurops_unimed', 'sompo_saude', 'sul_america_saude', 'total_medcare_saude', 'trasmontano_saude', 'unihosp_saude', 'unimed_nacional');

-- CreateTable
CREATE TABLE "patients" (
    "id" BIGSERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "social_name" TEXT NOT NULL,
    "insurance" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practitioners" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practitioners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" BIGSERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" BIGSERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practitioner_id" INTEGER NOT NULL,
    "patient_id" BIGINT NOT NULL,
    "clinic_id" BIGINT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registries" (
    "id" BIGSERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "assigned_at_birth" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "personal_number" TEXT NOT NULL,
    "household_number" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "patient_id" BIGINT NOT NULL,

    CONSTRAINT "registries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" BIGSERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "patient_id" BIGINT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "practitioners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registries" ADD CONSTRAINT "registries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
