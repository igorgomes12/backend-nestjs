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
import { LiderUserRepository } from "./repositories/lider_user_repository";
import { hash } from "bcryptjs";
import {
  CreateUserBodySchemaDto,
  type TCreateUserBodyFormDto,
} from "./dtos/create_user_body_dto";
import { ZodValidationPipe } from "./pipes/zod_validation_pipes";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class AppController {
  constructor(private liderUserRepository: LiderUserRepository) {}

  // GET
  @Get("list")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
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

  // DELETE
  @Delete("delete")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
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

  // PUT
  @Put("update")
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

  // POST
  @Post("create")
  @HttpCode(201)
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ZodValidationPipe(CreateUserBodySchemaDto))
  async postUser(@Body() body: TCreateUserBodyFormDto) {
    const {
      channel_user,
      company_user,
      email_login_user,
      name_user,
      password_user,
      profile_user,
      status_user,
    } = body;

    // Verifica se o email é nulo ou vazio
    if (!email_login_user) {
      throw new Error("Email não pode ser nulo ou vazio!");
    }

    // Verifica se o nome é nulo ou vazio
    if (!name_user) {
      throw new Error("Nome não pode ser nulo ou vazio!");
    }

    // Verifica se a senha é nula ou vazia
    if (!password_user) {
      throw new Error("Senha não pode ser nula ou vazia!");
    }

    // Verifica se o email já está cadastrado
    const existingUserByEmail =
      await this.liderUserRepository.findByEmail(email_login_user);
    if (existingUserByEmail) {
      throw new ConflictException("Email já cadastrado!");
    }

    // Verifica se o nome já está cadastrado
    const existingUserByName =
      await this.liderUserRepository.findByName(name_user);
    if (existingUserByName) {
      throw new ConflictException("Nome já cadastrado!");
    }

    // Gera o hash da senha
    const hashedPassword = await hash(password_user, 8);

    // Cria o usuário
    await this.liderUserRepository.create(
      name_user,
      email_login_user,
      hashedPassword,
      channel_user || 0,
      profile_user || 0,
      status_user || "",
      company_user || "",
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Usuário adicionado com sucesso!",
    };
  }
}
