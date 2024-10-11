import { TProductSchemaDto } from "../dto/products-type.dto";
import { ProductTypeEntity } from "../entity/product-type.entity";

export abstract class ProductsTypesService {
  abstract findAll(): Promise<ProductTypeEntity[]>;
  abstract findById(id: number): Promise<ProductTypeEntity>;
  abstract create(createProductDto: TProductSchemaDto): Promise<void>;
  abstract update(
    id: number,
    updateProductDto: TProductSchemaDto
  ): Promise<void>;
  abstract remove(id: number): Promise<void>;
}
