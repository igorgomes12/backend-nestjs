import { PrismaService } from "@infra/auth/database/prisma/prisma.service";

import { LicensesTypesService } from "features/licenses/domain/services/licenses-types.service";
import { LicensesService } from "./prisma/licenses-prisma.service";

const licenseServiceFactory = {
  provide: LicensesTypesService,
  useFactory: (prisma: PrismaService) => new LicensesService(prisma),
  inject: [PrismaService],
};

export { licenseServiceFactory };
