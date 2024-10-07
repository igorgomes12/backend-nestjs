import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { EstablishmentPrismaService } from "./prisma/establishment.service";
import { EstablishmentTypeService } from "features/establishment/domain/services/establishment-type.sevice";

const EstablishmentServiceFactory = {
  provide: EstablishmentTypeService,
  useFactory: (prisma: PrismaService) => new EstablishmentPrismaService(prisma),
  inject: [PrismaService],
};

export { EstablishmentServiceFactory };
