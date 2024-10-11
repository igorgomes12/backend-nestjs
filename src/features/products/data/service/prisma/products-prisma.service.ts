import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { TProductSchemaDto } from "features/products/domain/dto/products-type.dto";
import { ProductTypeEntity } from "features/products/domain/entity/product-type.entity";
import { ProductsTypesService } from "features/products/domain/services/products.services";

@Injectable()
export class ProductsService implements ProductsTypesService {
  constructor(private readonly service: PrismaService) {}

  findAll(): Promise<ProductTypeEntity[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<ProductTypeEntity> {
    throw new Error("Method not implemented.");
  }
  create(createProductDto: TProductSchemaDto): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(id: number, updateProductDto: TProductSchemaDto): Promise<void> {
    throw new Error("Method not implemented.");
  }
  remove(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
