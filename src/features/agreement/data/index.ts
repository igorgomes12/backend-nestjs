import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { AgreementService } from "./prisma/agreement.service";

const agreementServiceFactory = {
  provide: "AgreementTypeService",
  useFactory: (prisma: PrismaService) => new AgreementService(prisma),
  inject: [PrismaService],
};

export { agreementServiceFactory };
