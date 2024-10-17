import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { RepresentativeServiceTypes } from "features/representative/domain/services/representative.repositories";
import { RepresentativePrismaService } from "./prisma/representative-prisma.service";

const representativeServiceFactory = {
  provide: RepresentativeServiceTypes,
  useFactory: (prisma: PrismaService) =>
    new RepresentativePrismaService(prisma),
  inject: [PrismaService],
};

export { representativeServiceFactory };
