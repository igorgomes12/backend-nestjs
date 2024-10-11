import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { ProductsService } from "features/products/data/service/prisma/products-prisma.service";
import { TProductSchemaDto } from "features/products/domain/dto/products-type.dto";

@Controller("products")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: TProductSchemaDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: TProductSchemaDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
