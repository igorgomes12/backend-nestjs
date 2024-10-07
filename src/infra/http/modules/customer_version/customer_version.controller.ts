import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { CustomerVersion } from "features/customer-version/domain/entity/customer_version.entity";
import { CreateCustomerSystemUsecase } from "features/customer-version/domain/usecases/create_customer.usecases";
import { DeleteCustomerUsecase } from "features/customer-version/domain/usecases/delete_customer.usecases";
import { ListCustomerSystemUsecase } from "features/customer-version/domain/usecases/list_customer.usecases";
import { UpdateCustomerUseCase } from "features/customer-version/domain/usecases/update_customer.usecase";
import {
  customerVersionSchemaDto,
  TCustomerVersionDto,
} from "../../../../features/customer-version/domain/dto/zod_customer.dto";

@Controller("customer-version")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerVersionController {
  constructor(
    private readonly createCustomerSystemUsecase: CreateCustomerSystemUsecase,
    private readonly listCustomerSystemUsecase: ListCustomerSystemUsecase,
    private readonly deleteCustomerSystemUsecase: DeleteCustomerUsecase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase
  ) {}

  @Post()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(customerVersionSchemaDto))
  async create(@Body() data: TCustomerVersionDto) {
    try {
      const result = await this.createCustomerSystemUsecase.execute({
        system_id: data.system_id,
        version: data.version,
        customer_id: data.customer_id,
        assigned_date: data.assigned_date,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.listCustomerSystemUsecase.execute();
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async update(@Query("id") id: number, @Body() data: CustomerVersion) {
    try {
      const result = await this.updateCustomerUseCase.execute(id, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async remove(@Query("id") id: number) {
    try {
      const result = await this.deleteCustomerSystemUsecase.execute(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
