import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { hash } from "bcryptjs";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";
import { ZodValidationPipe } from "../../repositories/middleware/pipes/zod_validation_pipes";
import {
  CreateUserBodySchemaDto,
  TCreateUserBodyFormDto,
} from "./dtos/create_user_body_dto";

import { UserAddUseCase } from "@common/domain/usecases/usecases_user/user_add.usecase";
import { ServerError } from "@common/errors/server.error";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";

@Controller("/user")
export class AppController {
  constructor(
    private liderUserRepository: LiderUserRepository,
    private readonly signupUseCase: UserAddUseCase.UseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR",
    "SUPPORT",
    "SUPPORT_SUPERVISOR"
  )
  async getUsers(@Res() res: Response, @Query() query: TCreateUserBodyFormDto) {
    try {
      const users = await this.liderUserRepository.findAll();

      const filteredUsers = users.filter((user) => {
        return Object.keys(query).every((key) => {
          return user[key] && user[key].toString().includes(query[key]);
        });
      });

      if (filteredUsers.length === 0) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Usuário inexistente" });
      }

      return res.status(HttpStatus.OK).json(filteredUsers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao buscar usuários" });
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "PROGRAMMING")
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async deleteUser(@Res() res: Response, @Query("id") id: string) {
    try {
      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: "ID é necessário" });
      }

      const ID = Number(id);
      if (isNaN(ID)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: "Id inválido" });
      }

      const user = await this.liderUserRepository.findById(ID);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: "Usuário não encontrado" });
      }

      await this.liderUserRepository.delete(ID);

      return res.status(HttpStatus.OK).json({
        message: `O usuário ${ID} foi deletado com sucesso!`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao deletar usuário" });
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "PROGRAMMING")
  // @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async updateUser(
    @Res() res: Response,
    @Query("id") id: string,
    @Body() updateData: Partial<TCreateUserBodyFormDto>
  ) {
    try {
      const ID = Number(id);
      if (isNaN(ID)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: "Id inválido" });
      }

      const existingUser = await this.liderUserRepository.findById(ID);
      if (!existingUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: "Usuário não encontrado" });
      }

      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await hash(updateData.password, saltRounds);
      }

      const updatedUser = await this.liderUserRepository.update(ID, updateData);

      return res.status(HttpStatus.OK).json({
        message: "Usuário atualizado com sucesso",
        updatedUser,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao atualizar usuário" });
    }
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("ADMIN", "PROGRAMMING")
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async postUser(@Res() res: Response, @Body() body: TCreateUserBodyFormDto) {
    const {
      channel = 0,
      organization = "lider",
      email,
      name,
      password,
      profile,
      status,
    } = body;

    try {
      const user = await this.signupUseCase.execute({
        name,
        email,
        password,
        channel,
        profile,
        status,
        organization,
      });

      return res.status(HttpStatus.CREATED).json({
        data: user,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ error: error.message });
      }

      if (error instanceof ServerError) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Erro ao criar usuário",
      });
    }
  }
}
