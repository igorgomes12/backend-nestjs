import { PrismaModule } from "@infra/auth/database/prisma.module";
import { Module } from "@nestjs/common";
import { productsServiceFactory } from "features/products/data/service";
import { ProductsService } from "features/products/data/service/prisma/products-prisma.service";
import { ProductsController } from "./products.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, productsServiceFactory],
})
export class ProductsModule {}
