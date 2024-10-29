import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";

import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { AllExceptionsFilter } from "core/filters/exception.filter";

import { FindAllClientUseCase } from "features/clients/domain/usecases/find-all-client.usecase";
import { CreateClientUseCase } from "features/clients/domain/usecases/create-client.usecase";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
  ClientSchema,
  TClient,
} from "features/clients/domain/dto/zod_client.schema";
import { DeleteClientUsecase } from "features/clients/domain/usecases/delete-client.usecase";
import { UpdateClientUsecase } from "features/clients/domain/usecases/update-client.usecase";
import { FindByIdClient } from "features/clients/domain/usecases/find-by-id-client.usecase";

@Controller("client")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class ClientController {
  constructor(
    private readonly findAllClientUseCase: FindAllClientUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUsecase,
    private readonly updateClientUseCase: UpdateClientUsecase,
    private readonly findByIdClient: FindByIdClient
  ) {}

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
    const client = await this.createClientUseCase.execute(body);
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
  async getAllClients() {
    return await this.findAllClientUseCase.execute();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  async findById(@Param("id") id: number) {
    const representative = await this.findByIdClient.execute(id);
    if (!representative) {
      throw new NotFoundException(`Representante com ID ${id} não encontrado`);
    }
    return representative;
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

    return this.updateClientUseCase.execute(clientId, updateClientDto);
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
  async remove(@Query("id") id: number) {
    await this.deleteClientUseCase.execute(id);
    return { message: "Removido com sucesso" };
  }
}
