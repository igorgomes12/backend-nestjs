import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { SystemVersionPrismaRepositories } from "@infra/http/modules/system_version/repositories/system_version_prisma.repositories";

const SystemVersionServiceFactory = {
  provide: SystemVersionPrismaRepositories,
  useFactory: (prisma: PrismaService) =>
    new SystemVersionPrismaRepositories(prisma),
  inject: [PrismaService],
};

export { SystemVersionServiceFactory };
