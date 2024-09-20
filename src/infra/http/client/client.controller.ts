import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/middleware/decorator.rolues";
import { RolesGuard } from "@infra/middleware/roles_guard";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  Res,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { ClientService } from "./client.service";
import type { TClient } from "./dto/schemas/zod_client.schema";

@Controller("client")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Res() res: Response, @Body() body: TClient) {
    try {
      // Chamando o serviço para criar o cliente
      const client = await this.clientService.create(body);

      // Retornando a resposta de sucesso
      return res.status(HttpStatus.CREATED).json({
        message: "Criado com sucesso",
        client,
      });
    } catch (error) {
      // Tratamento de erros específicos
      if (error instanceof BadRequestException) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: error.message });
      }

      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
      }

      // Tratamento de erro genérico
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Erro ao criar cliente",
      });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getClient(@Res() res: Response, @Query() query: TClient) {
    const { contacts } = query;

    if (contacts && contacts.length > 0) {
      this.clientService.validateContacts(contacts);
    }

    const client = await this.clientService.findAll();

    return res.status(HttpStatus.OK).json(client);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findOne(@Query("id") id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(@Query("id") id: string, @Body() updateClientDto: any) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@Query("id") id: string) {
    return this.clientService.remove(+id);
  }
}
