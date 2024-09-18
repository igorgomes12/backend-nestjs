/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "contactType" AS ENUM ('Telefone', 'Celular', 'Email', 'WhatsApp', 'Facebook', 'Instagram', 'LinkedIn', 'Youtube', 'Twitter');

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_profileId_fkey";

-- DropTable
DROP TABLE "public"."profiles";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "channel" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "organization" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "corporate" VARCHAR(100) NOT NULL,
    "fantasy" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(14) NOT NULL,
    "representative" VARCHAR(50) NOT NULL,
    "unit" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "establishmentType" TEXT NOT NULL,
    "cpf_cnpj" VARCHAR(20),
    "stateRegistration" VARCHAR(20) NOT NULL,
    "municipalRegistration" VARCHAR(20),
    "ruralRegistration" VARCHAR(20),
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL DEFAULT 1,
    "representativeId" INTEGER,
    "ownerId" INTEGER,
    "addressId" INTEGER,
    "contactId" INTEGER,
    "contabilityId" INTEGER,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(14) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "type" "contactType" NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contabilities" (
    "id" SERIAL NOT NULL,
    "codContability" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(14) NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "crc" TEXT NOT NULL,
    "cpf_cnpj" VARCHAR(14) NOT NULL,
    "organization" INTEGER NOT NULL,

    CONSTRAINT "contabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(60),
    "number" VARCHAR(60),
    "complement" VARCHAR(60),
    "neighborhood" VARCHAR(60),
    "city" VARCHAR(60),
    "state" VARCHAR(2),
    "postalCode" VARCHAR(10),
    "isActive" VARCHAR(1),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "codUnit" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "corporate" TEXT NOT NULL,
    "cpf_cnpj" VARCHAR(14) NOT NULL,
    "webServiceKey" VARCHAR(1),
    "phone" VARCHAR(15),
    "addressId" INTEGER,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representatives" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(14) NOT NULL,

    CONSTRAINT "representatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owners" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "cpf_cnpj" VARCHAR(15) NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_name_key" ON "profiles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_corporate_key" ON "clients"("corporate");

-- CreateIndex
CREATE UNIQUE INDEX "clients_fantasy_key" ON "clients"("fantasy");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_key" ON "clients"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "clients_representative_key" ON "clients"("representative");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_name_key" ON "contacts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_key" ON "contacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contabilities_name_key" ON "contabilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contabilities_phone_key" ON "contabilities"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "contabilities_cpf_cnpj_key" ON "contabilities"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_cpf_cnpj_key" ON "organizations"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "representatives_email_key" ON "representatives"("email");

-- CreateIndex
CREATE UNIQUE INDEX "representatives_phone_key" ON "representatives"("phone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_contabilityId_fkey" FOREIGN KEY ("contabilityId") REFERENCES "contabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
