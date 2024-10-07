import { PrismaService } from "@infra/auth/database/prisma/prisma.service";

import { LicensesTypesService } from "features/licenses/domain/services/licenses-types.service";
import { LincesesService } from "./prisma/licenses-prisma.service";

const licenseServiceFactory = {
  provide: LicensesTypesService,
  useFactory: (prisma: PrismaService) => new LincesesService(prisma),
  inject: [PrismaService],
};

export { licenseServiceFactory };
