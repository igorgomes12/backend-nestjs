import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  BadRequestException,
  Body,
  ConflictException,
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
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { Response } from "express";
import { TCreateUserBodyFormDto } from "../../../../features/user/domain/dto/user_body_dto";

import { AllExceptionsFilter } from "core/filters/exception.filter";
import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { type TUpdateUserSchemaDto } from "features/user/domain/dto/update_body.dto";
import { CreateUserUseCase } from "features/user/domain/usecases/create_user.usecase";
import { DeleteUserUsecase } from "features/user/domain/usecases/delete_user.usecase";
import { FindAllUserUseCase } from "features/user/domain/usecases/find_all_user.usecase";
import { UpdateUserUsecase } from "features/user/domain/usecases/update_user.usecase";
import { JwtAuthGuard } from "../../guards/decorators/jwt_auth.decorator";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";

@Controller("/user")
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUsecase,
    private readonly updateUserUseCase: UpdateUserUsecase
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
  async deleteUser(@Res() res: Response, @Query("id") id: string) {
    try {
      await this.deleteUserUseCase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `O usuário com ID ${id} foi deletado com sucesso!`,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return res.status(error.getStatus()).json({ error: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao deletar usuário" });
    }
  }

  @Patch()
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
    @Body() updateData: Partial<TUpdateUserSchemaDto>
  ) {
    try {
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await hash(updateData.password, saltRounds);
      }

      const updatedUser = await this.updateUserUseCase.execute(id, updateData);

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return res.status(error.getStatus()).json({ error: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao atualizar usuário" });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("ADMIN", "PROGRAMMING")
  @UsePipes(new ZodValidationPipe(createBodySchemaDto))
  async postUser(@Res() res: Response, @Body() body: TCreateUserBodyFormDto) {
    try {
      const { password } = body;

      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      await this.createUserUseCase.execute({
        ...body,
        password: hashedPassword,
      });

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          status: HttpStatus.CONFLICT,
          message: error.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro ao cadastrar usuário",
      });
    }
  }
}
