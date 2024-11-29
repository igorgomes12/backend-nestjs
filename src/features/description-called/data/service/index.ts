import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { DescriptionCalledPrismaService } from "./prisma/description-called-prisma.service";
import { DescriptionCalledService } from "features/description-called/domain/services/description-called.service";

const DescriptionCalledServiceFactory = {
  provide: DescriptionCalledService, // Ensure this matches the expected service interface
  useFactory: (prisma: PrismaService) =>
    new DescriptionCalledPrismaService(prisma),
  inject: [PrismaService],
};

export { DescriptionCalledServiceFactory };
