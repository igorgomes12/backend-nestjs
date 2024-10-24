/*
  Warnings:

  - You are about to drop the `Accounting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer_System_Version` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Establishment_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Municipio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `System` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `System_Version` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "TypeRepresentative" AS ENUM ('REPRESENTATIVE', 'CONSULTANT', 'PARTHER');

-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_establishment_typeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_id_account_fkey";

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_systemsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Customer_System_Version" DROP CONSTRAINT "Customer_System_Version_system_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Owner" DROP CONSTRAINT "Owner_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."System_Version" DROP CONSTRAINT "System_Version_system_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_profileId_fkey";

-- DropTable
DROP TABLE "public"."Accounting";

-- DropTable
DROP TABLE "public"."Address";

-- DropTable
DROP TABLE "public"."Client";

-- DropTable
DROP TABLE "public"."Contact";

-- DropTable
DROP TABLE "public"."Customer_System_Version";

-- DropTable
DROP TABLE "public"."Establishment_type";

-- DropTable
DROP TABLE "public"."Municipio";

-- DropTable
DROP TABLE "public"."Owner";

-- DropTable
DROP TABLE "public"."System";

-- DropTable
DROP TABLE "public"."System_Version";

-- DropTable
DROP TABLE "public"."profiles";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "channel" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "organization" TEXT,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "corporate_name" TEXT NOT NULL,
    "fantasy_name" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "state_registration" TEXT NOT NULL,
    "municipal_registration" TEXT,
    "rural_registration" TEXT,
    "name_account" TEXT,
    "id_account" INTEGER NOT NULL,
    "establishment_typeId" INTEGER NOT NULL,
    "systemsId" INTEGER NOT NULL,
    "representative_id" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "complement" TEXT,
    "postal_code" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "municipality_id" INTEGER,
    "municipality_name" TEXT NOT NULL,
    "state_id" INTEGER,
    "state" TEXT NOT NULL,
    "country_id" INTEGER,
    "region_id" INTEGER,
    "description" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" INTEGER,
    "representativeId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "contact" TEXT,
    "cellphone" TEXT,
    "phone" TEXT,
    "type" TEXT,
    "email" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" INTEGER,
    "representativeId" INTEGER,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establishment_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Establishment_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounting" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "crc" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "Accounting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "System" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "stable_version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "System_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "System_Version" (
    "id" SERIAL NOT NULL,
    "system_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "System_Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer_System_Version" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "system_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_System_Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" SERIAL NOT NULL,
    "mun_cd_municipio" INTEGER NOT NULL,
    "mun_ds_municipio" TEXT NOT NULL,
    "mun_ds_uf" TEXT NOT NULL,
    "mun_ds_estado" TEXT NOT NULL,
    "mun_cd_estado" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "first_due_date" TIMESTAMP(3) NOT NULL,
    "number" TEXT NOT NULL,
    "observation" TEXT,
    "monthly_fee" DOUBLE PRECISION NOT NULL,
    "seller_id" TEXT NOT NULL,
    "fee_type" "FeeType" NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Licenses" (
    "id" SERIAL NOT NULL,
    "contract_id" TEXT NOT NULL,
    "system_id" INTEGER NOT NULL,
    "settings" JSONB NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "monthly_fee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "payment_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractHistory" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "old_value" DOUBLE PRECISION NOT NULL,
    "new_value" DOUBLE PRECISION NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL,
    "changed_by" TEXT NOT NULL,
    "cancellation_date" TIMESTAMP(3),
    "cancellation_reason" TEXT,

    CONSTRAINT "ContractHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representative" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cellphone" TEXT,
    "phone" TEXT,
    "supervisor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" "TypeRepresentative" NOT NULL,
    "region" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" SERIAL NOT NULL,
    "implantation" INTEGER NOT NULL,
    "mensality" INTEGER NOT NULL,
    "representativeId" INTEGER NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentsType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deleteDate" TIMESTAMP(3),

    CONSTRAINT "PaymentsType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_name_key" ON "profiles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_type_name_key" ON "Establishment_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "System_name_key" ON "System"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_representative_id_fkey" FOREIGN KEY ("representative_id") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_establishment_typeId_fkey" FOREIGN KEY ("establishment_typeId") REFERENCES "Establishment_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_account_fkey" FOREIGN KEY ("id_account") REFERENCES "Accounting"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_systemsId_fkey" FOREIGN KEY ("systemsId") REFERENCES "System"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "System_Version" ADD CONSTRAINT "System_Version_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "System"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_System_Version" ADD CONSTRAINT "Customer_System_Version_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "System"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractHistory" ADD CONSTRAINT "ContractHistory_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
