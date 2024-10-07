import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemVersionPrismaRepositories } from "./prisma/system-version.service";
import { SystemVersionRepository } from "features/system-version/domain/services/system_version.repositories";

const SystemVersionServiceFactory = {
  provide: SystemVersionRepository,
  useFactory: (prisma: PrismaService) =>
    new SystemVersionPrismaRepositories(prisma),
  inject: [PrismaService],
};

export { SystemVersionServiceFactory };
