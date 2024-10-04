import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
  type TClient,
} from "features/clients/domain/dto/zod_client.schema";

@Controller("client")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
@UsePipes(new ZodValidationPipe(ClientSchema))
export class ClientController {
  constructor(
    private readonly findAllClientUseCase: FindAllClientUseCase,
    private readonly createClientUseCase: CreateClientUseCase
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

  // @Patch()
  // @HttpCode(HttpStatus.OK)
  // @Roles(
  //   "ADMIN",
  //   "FINANCE",
  //   "REPRESENTATIVE",
  //   "REPRESENTATIVE_SUPERVISOR",
  //   "SUPPORT_SUPERVISOR",
  //   "PROGRAMMING_SUPERVISOR"
  // )
  // async update(@Query("id") id: string, @Body() updateClientDto: TClient) {
  //   const clientId = Number(id);
  //   if (isNaN(clientId)) {
  //     throw new BadRequestException("ID inválido fornecido.");
  //   }

  //   return this.clientService.update(clientId, updateClientDto);
  // }
  // @Delete()
  // @HttpCode(HttpStatus.OK)
  // @Roles(
  //   "ADMIN",
  //   "FINANCE",
  //   "REPRESENTATIVE",
  //   "REPRESENTATIVE_SUPERVISOR",
  //   "SUPPORT_SUPERVISOR",
  //   "PROGRAMMING_SUPERVISOR"
  // )
  // @UsePipes(new ZodValidationPipe(ClientSchema))
  // async remove(@Query("id") id: number) {
  //   await this.clientService.remove(id);
  //   return { message: "Removido com sucesso" };
  // }
}
