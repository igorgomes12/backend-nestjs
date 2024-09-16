// app.controller.ts
import { LiderUserRepository } from "@/infra/repositories/lider_user_repository";
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
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "../pipes/zod_validation_pipes";
import {
  CreateUserBodySchemaDto,
  TCreateUserBodyFormDto,
} from "./dtos/create_user_body_dto";
import { JwtAuthGuard } from "@/infra/auth/guards/jwt_auth.guard";
import { RolesGuard } from "@/infra/middleware/roles_guard";
import { Roles } from "@/infra/middleware/decorator.rolues";

@Controller("/user")
export class AppController {
  constructor(private liderUserRepository: LiderUserRepository) {}

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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async postUser(@Body() body: TCreateUserBodyFormDto) {
    console.log("Dados recebidos no POST:", body);
    const { channel, company, email, name, password, profile, status } = body;

    if (!email) {
      throw new Error("Email não pode ser nulo ou vazio!");
    }

    if (!name) {
      throw new Error("Nome não pode ser nulo ou vazio!");
    }

    if (!password) {
      throw new Error("Senha não pode ser nula ou vazia!");
    }

    const existingUserByEmail =
      await this.liderUserRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException("Email já cadastrado!");
    }

    const existingUserByName = await this.liderUserRepository.findByName(name);
    if (existingUserByName) {
      throw new ConflictException("Nome já cadastrado!");
    }

    const hashedPassword = await hash(password, 8);

    await this.liderUserRepository.create(
      name,
      email,
      hashedPassword,
      channel || 0,
      profile || "",
      status || "",
      company || ""
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: "Usuário adicionado com sucesso!",
    };
  }
}
