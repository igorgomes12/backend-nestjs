import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  UseFilters,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  Logger,
} from "@nestjs/common";
import { CustomerVersionService } from "./customer_version.service";
import { TInput } from "./entities/customer_version.entity";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
import {
  customerVersionSchemaDto,
  TCustomerVersionDto,
} from "./dto/zod_customer.dto";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";

@Controller("customer-version")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerVersionController {
  private readonly logger = new Logger(CustomerVersionController.name);

  constructor(
    private readonly customerVersionService: CustomerVersionService
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
    this.logger.log("Recebendo solicitação para criar CustomerVersion", data);
    try {
      const result = await this.customerVersionService.create({
        system_id: data.system_id,
        version: data.version,
      });
      this.logger.log("CustomerVersion criado com sucesso", result);
      return result;
    } catch (error) {
      this.logger.error("Erro ao criar CustomerVersion", error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    this.logger.log(
      "Recebendo solicitação para buscar todos os CustomerVersions"
    );
    try {
      const result = await this.customerVersionService.findAll();
      this.logger.log("CustomerVersions encontrados com sucesso", result);
      return result;
    } catch (error) {
      this.logger.error("Erro ao buscar todos os CustomerVersions", error);
      throw error;
    }
  }

  @Get()
  async findOne(@Query("id") id: string) {
    this.logger.log(
      `Recebendo solicitação para buscar CustomerVersion com ID ${id}`
    );
    try {
      const result = await this.customerVersionService.findOne(+id);
      this.logger.log(
        `CustomerVersion com ID ${id} encontrado com sucesso`,
        result
      );
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar CustomerVersion com ID ${id}`, error);
      throw error;
    }
  }

  @Patch()
  async update(@Query("id") id: string, @Body() data: Partial<TInput>) {
    this.logger.log(
      `Recebendo solicitação para atualizar CustomerVersion com ID ${id}`,
      data
    );
    try {
      const result = await this.customerVersionService.update(+id, data);
      this.logger.log(
        `CustomerVersion com ID ${id} atualizado com sucesso`,
        result
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar CustomerVersion com ID ${id}`,
        error
      );
      throw error;
    }
  }

  @Delete()
  async remove(@Query("id") id: string) {
    this.logger.log(
      `Recebendo solicitação para remover CustomerVersion com ID ${id}`
    );
    try {
      const result = await this.customerVersionService.remove(+id);
      this.logger.log(`CustomerVersion com ID ${id} removido com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao remover CustomerVersion com ID ${id}`, error);
      throw error;
    }
  }
}
