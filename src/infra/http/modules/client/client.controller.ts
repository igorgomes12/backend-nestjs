import { Roles } from "@infra/http/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  BadRequestException,
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
import {
  ClientSchema,
  type TClient,
} from "@common/domain/entities/entities_client/zod_client.schema";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { customerVersionSchemaDto } from "../customer_version/dto/zod_customer.dto";
import { ClientService } from "@common/domain/service/service_client/client.service";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";

@Controller("client")
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ZodValidationPipe(customerVersionSchemaDto))
@UseFilters(AllExceptionsFilter)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(ClientSchema))
  async create(@Body() body: TClient) {
    const client = await this.clientService.create(body);
    return {
      message: "Criado com sucesso",
      client,
    };
  }

  @Get()
  @Roles(
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR",
    "SUPPORT",
    "ADMIN"
  )
  @HttpCode(HttpStatus.OK)
  async getAllClients(
    @Query("cpf_cnpj") cpf_cnpj?: string,
    @Query("fantasy_name") fantasy_name?: string,
    @Query("id") id?: number,
    @Query("corporate_name") corporate_name?: string
  ) {
    const clients = await this.clientService.filterClients({
      cpf_cnpj,
      fantasy_name,
      id,
      corporate_name,
    });
    return clients;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  async update(@Query("id") id: string, @Body() updateClientDto: TClient) {
    const clientId = Number(id);
    if (isNaN(clientId)) {
      throw new BadRequestException("ID inválido fornecido.");
    }

    return this.clientService.update(clientId, updateClientDto);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(ClientSchema))
  async remove(@Query("id") id: number) {
    await this.clientService.remove(id);
    return { message: "Removido com sucesso" };
  }
}
