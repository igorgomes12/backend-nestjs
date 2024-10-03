import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
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
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { Response } from "express";
import {
  createUserBodySchemaDto,
  TCreateUserBodyFormDto,
} from "../../../features/user/domain/dto/user_body_dto";
import { ZodValidationPipe } from "../../repositories/middleware/pipes/zod_validation_pipes";

import { UserAddUseCase } from "@common/domain/usecases/usecases_user/user_add.usecase";
import { ServerError } from "@common/errors/server.error";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { CreateUserUseCase } from "features/user/domain/usecases/create_user.usecase";
import { FindAllUserUseCase } from "features/user/domain/usecases/find_all_user.usecase";

@Controller("/user")
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(
    private liderUserRepository: LiderUserRepository,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase
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
  async getUsers(@Res() res: Response, @Query() query: TCreateBodySchemaDto) {
    try {
      const users = await this.findAllUserUseCase.execute(query);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao buscar usuários" });
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(createUserBodySchemaDto))
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
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "PROGRAMMING")
  @UsePipes(new ZodValidationPipe(createBodySchemaDto))
  async postUser(@Res() res: Response, @Body() body: TCreateUserBodyFormDto) {
    try {
      const { password } = body;

      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const user = await this.createUserUseCase.execute({
        ...body,
        password: hashedPassword,
      });

      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ error: error.message });
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao cadastrar usuário" });
    }
  }
}
