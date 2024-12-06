-- CreateEnum
CREATE TYPE "TypeSituationAgreement" AS ENUM ('ACORDADO', 'NAO_ACORDADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TypeSituationPaymentAgreement" AS ENUM ('RECEBER_DO_CLIENTE', 'REBECER_AQUI', 'DEPOSITO', 'BOLETO');

-- CreateTable
CREATE TABLE "Agreement" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "representativeId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "paymment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT NOT NULL,
    "observation" TEXT,
    "situation" "TypeSituationAgreement" NOT NULL,
    "situatonpayment" "TypeSituationPaymentAgreement" NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
