-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TypeCalled" AS ENUM ('BUG', 'ASSISTANCE');

-- CreateEnum
CREATE TYPE "TypeContact" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP', 'MOBILE');

-- CreateEnum
CREATE TYPE "TypeSolutions" AS ENUM ('PHONE', 'IN_PERSON', 'REMOTE');

-- CreateTable
CREATE TABLE "Called" (
    "id" SERIAL NOT NULL,
    "priority" "Priority" NOT NULL,
    "caller" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "type" "TypeCalled" NOT NULL,
    "contact" "TypeContact" NOT NULL,
    "system" TEXT,
    "module" TEXT NOT NULL,
    "requested" TEXT NOT NULL,
    "note" TEXT,
    "response" TEXT,
    "solutionType" "TypeSolutions" NOT NULL,
    "duration" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "timestampFinally" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "timestamp" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Called_pkey" PRIMARY KEY ("id")
);
