import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { AccountPrismaService } from "./prisma/account-prisma.service";

const accountServiceFactory = {
  provide: "AccountServiceMethods",
  useFactory: (prisma: PrismaService) => new AccountPrismaService(prisma),
  inject: [PrismaService],
};

export { accountServiceFactory };
