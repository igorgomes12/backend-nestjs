-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "type" SET DEFAULT 'TELEFONE';

-- AlterTable
ALTER TABLE "Contracts" ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "fee_type" SET DEFAULT 'FIXED';

-- AlterTable
ALTER TABLE "Representative" ALTER COLUMN "type" SET DEFAULT 'REPRESENTATIVE';

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "observation" TEXT,
    "status" BOOLEAN NOT NULL,
    "bank" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "deleteDate" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
