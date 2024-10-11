import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ProductsTypesService } from "features/products/domain/services/products.services";
import { ProductsService } from "./prisma/products-prisma.service";

const productsServiceFactory = {
  provide: ProductsTypesService,
  useFactory: (prisma: PrismaService) => new ProductsService(prisma),
  inject: [PrismaService],
};

export { productsServiceFactory };
