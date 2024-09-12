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


import { CreateUserBodySchemaDto, type TCreateUserBodyFormDto } from "./dtos/create_user_body_dto";

import { hash } from 'bcryptjs'
import { ZodValidationPipe } from "../pipes/zod_validation_pipes";
import { JwtAuthGuard } from "@/infra/auth/jwt_auth.guard";
import type { LiderUserRepository } from "@/infra/repositories/lider_user_repository";

@Controller("user")
export class AppController {
  liderUserRepository: any;
  // constructor(private readonly liderUserRepository: LiderUserRepository) {}
  @Get()
  @HttpCode(200)
  async getUsers(@Query() query: TCreateUserBodyFormDto) {
    const users = await this.liderUserRepository.findAll();

    // Filtrar usuários com base nos parâmetros de consulta
    const filteredUsers = users.filter((user) => {
      return Object.keys(query).every((key) => {
        return user[key] && user[key].toString().includes(query[key]);
      });
    });

    // Verificar se nenhum usuário foi encontrado
    if (filteredUsers.length === 0) {
      throw new HttpException("Usuário inexistente", HttpStatus.NOT_FOUND);
    }

    return filteredUsers;
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Query("id") id: string) {
    if (!id) {
      throw new Error("ID é necessário");
    }

    const ID = Number(id);
    if (isNaN(ID)) {
      throw new Error("Id invalido");
    }
    await this.liderUserRepository.delete(ID);
    return {
      statusCode: HttpStatus.OK,
      message: `O usuário ${ID} foi deletado com sucesso!`,
    };
  }


  @Put()
  @HttpCode(200)
  async updateUser(
    @Query("id") id: string,
    @Body() updateData: Partial<TCreateUserBodyFormDto>,
  ) {
    const ID = Number(id);
    if (isNaN(ID)) {
      throw new Error("Id invalido");
    }
    const updatedUser = await this.liderUserRepository.update(ID, updateData);
    return { statusCode: HttpStatus.OK, updatedUser };
  }


  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async postUser(@Body() body: TCreateUserBodyFormDto) {
    const {
      channel,
      company,
      email,
      name,
      password,
      profile,
      status,
    } = body;

    // Verifica se o email é nulo ou vazio
    if (!email) {
      throw new Error("Email não pode ser nulo ou vazio!");
    }

    // Verifica se o nome é nulo ou vazio
    if (!name) {
      throw new Error("Nome não pode ser nulo ou vazio!");
    }

    // Verifica se a senha é nula ou vazia
    if (!password) {
      throw new Error("Senha não pode ser nula ou vazia!");
    }

    // Verifica se o email já está cadastrado
    const existingUserByEmail =
      await this.liderUserRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException("Email já cadastrado!");
    }

    // Verifica se o nome já está cadastrado
    const existingUserByName =
      await this.liderUserRepository.findByName(name);
    if (existingUserByName) {
      throw new ConflictException("Nome já cadastrado!");
    }

    // Gera o hash da senha
    const hashedPassword = await hash(password, 8);

    // Cria o usuário
    await this.liderUserRepository.create(
      name,
      email,
      hashedPassword,
      channel || 0,
      profile || 0,
      status || "",
      company || "",
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Usuário adicionado com sucesso!",
    };
  }
}
