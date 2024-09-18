
import { Roles } from "@infra/middleware/decorator.rolues";
import { RolesGuard } from "@infra/middleware/roles_guard";
import { LiderUserRepository } from "@infra/repositories/lider_user_repository";
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod_validation_pipes";
import {
  CreateUserBodySchemaDto,
  TCreateUserBodyFormDto,
} from "./dtos/create_user_body_dto";

import { ServerError } from "@common/errors/server.error";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { UserAddUseCase } from "@common/domain/usecases/user_add.usecase";

enum UserProfile {
  User = "user",
  Admin = "admin",
  Suport = "suport",
  Sellers = "sellers",
  UserBasic = "user_basic",
  UserIntermediate = "user_intermediate",
  UserPremium = "user_premium",
}

enum UserStatus {
  Ativo = "ativo",
  Inativo = "inativo",
}

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
    "admin",
    "user",
    "suport",
    "sellers",
    "user_basic",
    "user_intermediate",
    "user_premium"
  )
  async getUsers(@Query() query: TCreateUserBodyFormDto) {
    const users = await this.liderUserRepository.findAll();
    const filteredUsers = users.filter((user) => {
      return Object.keys(query).every((key) => {
        return user[key] && user[key].toString().includes(query[key]);
      });
    });
    if (filteredUsers.length === 0) {
      throw new HttpException("Usuário inexistente", HttpStatus.NOT_FOUND);
    }

    return filteredUsers;
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteUser(@Query("id") id: string) {
    if (!id) {
      throw new Error("ID é necessário");
    }
    const ID = Number(id);
    if (isNaN(ID)) {
      throw new Error("Id inválido");
    }

    const user = await this.liderUserRepository.findById(ID);
    if (!user) {
      throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
    }

    await this.liderUserRepository.delete(ID);
    return {
      statusCode: HttpStatus.OK,
      message: `O usuário ${ID} foi deletado com sucesso!`,
    };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async updateUser(
    @Query("id") id: string,
    @Body() updateData: Partial<TCreateUserBodyFormDto>
  ) {
    const ID = Number(id);
    if (isNaN(ID)) {
      throw new Error("Id inválido");
    }
    const existingUser = await this.liderUserRepository.findById(ID);
    if (!existingUser) {
      throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.liderUserRepository.update(ID, updateData);
    return { statusCode: HttpStatus.OK, updatedUser };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async postUser(@Body() body: TCreateUserBodyFormDto) {
    console.log("Dados recebidos no POST:", body);

    // Extraindo dados do corpo da requisição
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
    
      return {      
        data: user,
      };

    } catch (error) {    
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof ServerError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }      
      throw new HttpException(
        "Erro ao criar usuário",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
