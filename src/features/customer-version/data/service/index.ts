import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { CustomerSystemVersionRepositoryTypes } from "features/customer-version/domain/services/customer_system_version_types.repositories";
import { CustomerSystemVersionRepositories } from "./prisma/customer-prisma.service";

const CustomerVersionServiceFactory = {
  provide: CustomerSystemVersionRepositoryTypes,
  useFactory: (prisma: PrismaService) =>
    new CustomerSystemVersionRepositories(prisma),
  inject: [PrismaService],
};

export { CustomerVersionServiceFactory };
