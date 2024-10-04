import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { AccoutingPrismaService } from "./prisma/accouting_prisma.service";

const accountingServiceFactory = {
  provide: "AccoutingServiceMethods",
  useFactory: (prisma: PrismaService) => new AccoutingPrismaService(prisma),
  inject: [PrismaService],
};

export { accountingServiceFactory };
