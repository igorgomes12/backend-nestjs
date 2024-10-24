import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { FormsPaymentService } from "../domain/services/forms-payment.service";
import { PaymentServicePrisma } from "./service/prisma/payment-prisma.service";

export const paymentServiceFactory = {
  provide: FormsPaymentService,
  useFactory: (prisma: PrismaService) => new PaymentServicePrisma(prisma),
  inject: [PrismaService],
};
