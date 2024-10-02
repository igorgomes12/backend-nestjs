import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { UserService } from "features/user/domain/services/user.service";
import { UserPrismaService } from "./prisma/user_prisma.service";

const UserServiceFactory = {
  provide: UserService,
  useFactory: (prisma: PrismaService) => new UserPrismaService(prisma),
  inject: [PrismaService],
};

export { UserServiceFactory };
