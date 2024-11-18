-- CreateEnum
CREATE TYPE "ModuleSystemTypes" AS ENUM ('FRENTE', 'RETAGUARDA', 'LIDERPDV', 'LIDERODONTO', 'WEBLIDER', 'OUTROS');

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "system" "ModuleSystemTypes" NOT NULL,
    "module" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);
