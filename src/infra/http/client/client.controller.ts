import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
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
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ClientService } from "../../../common/domain/service/service_client/client.service";
import {
  ClientSchema,
  type TClient,
} from "@common/domain/entities/entities_client/zod_client.schema";

@Controller("client")
@UseGuards(JwtAuthGuard, RolesGuard)
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
