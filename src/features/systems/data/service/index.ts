import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemPrismaRepository } from "./prisma/systems-prisma.service";
import { SystemRepository } from "features/systems/domain/services/system.repositories";

const SystemServiceFactory = {
  provide: SystemRepository,
  useFactory: (prisma: PrismaService) => new SystemPrismaRepository(prisma),
  inject: [PrismaService],
};

export { SystemServiceFactory };
