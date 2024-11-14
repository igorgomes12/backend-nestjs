import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { CalledPrismaService } from "./prisma/called_prisma.service";

const calledServiceFactory = {
  provide: "CalledTypeService",
  useFactory: (prisma: PrismaService) => new CalledPrismaService(prisma),
  inject: [PrismaService],
};

export { calledServiceFactory };
