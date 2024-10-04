import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ClientEntityService } from "features/clients/domain/services/clients.service";
import { ClientsPrismaService } from "../prisma/clients-prisma.service";

const clientServiceFactory = {
  provide: ClientEntityService,
  useFactory: (prisma: PrismaService) => new ClientsPrismaService(prisma),
  inject: [PrismaService],
};

export { clientServiceFactory };
