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
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import z from "zod";
import { ClientService } from "./client.service";
import { ClientSchema, type TClient } from "./dto/schemas/zod_client.schema";

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
    const clients = await this.clientService.findAll();

    return res.status(HttpStatus.OK).json(clients);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findOne(@Query("id") id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Query("id") id: number, @Body() updateClientDto: TClient) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: number) {
    return this.clientService.remove(id);
  }
}
