import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
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
import { CustomerVersionService } from "./customer_version.service";
import {
  customerVersionSchemaDto,
  TCustomerVersionDto,
} from "./dto/zod_customer.dto";
import { TInput } from "./entities/customer_version.entity";
import { CreateCustomerSystemUsecase } from "./usecases/create_customer.usecases";

@Controller("customer-version")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerVersionController {
  constructor(
    private readonly customerVersionService: CustomerVersionService,
    private readonly Create: CreateCustomerSystemUsecase
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
      const result = await this.Create.execute({
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
      const result = await this.customerVersionService.findAll();
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findOne(@Query("id") id: number) {
    try {
      const result = await this.customerVersionService.findOne(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async update(@Query("id") id: number, @Body() data: Partial<TInput>) {
    try {
      const result = await this.customerVersionService.update(id, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async remove(@Query("id") id: number) {
    try {
      const result = await this.customerVersionService.remove(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
