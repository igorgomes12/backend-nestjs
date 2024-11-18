import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ModulePrismaService } from "./prisma/module-prisma.service";

const moduleServiceFactory = {
  provide: "ModuleServiceTypes",
  useFactory: (prisma: PrismaService) => new ModulePrismaService(prisma),
  inject: [PrismaService],
};

export { moduleServiceFactory };
