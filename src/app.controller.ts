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
} from '@nestjs/common'
import { CreateUserBody } from './dtos/create_user_body'
import { LiderUserRepository } from './repositories/lider_user_repository'
import { hash } from 'bcryptjs'

@Controller('user')
export class AppController {
  constructor(private liderUserRepository: LiderUserRepository) {}

  // GET
  @Get('list')
  @HttpCode(200)
  async getUsers() {
    return await this.liderUserRepository.findAll()
  }

  // DELETE
  @Delete('delete')
  async deleteUser(@Query('id') id: string) {
    if (!id) {
      throw new Error('ID is required')
    }

    const ID = Number(id)
    if (isNaN(ID)) {
      throw new Error('Id invalido')
    }
    await this.liderUserRepository.delete(ID)
    return {
      statusCode: HttpStatus.OK,
      message: `O usuário ${ID} foi deletado com sucesso!`,
    }
  }

  // PUT
  @Put('update')
  async updateUser(
    @Query('id') id: string,
    @Body() updateData: Partial<CreateUserBody>,
  ) {
    const ID = Number(id)
    if (isNaN(ID)) {
      throw new Error('Id invalido')
    }
    const updatedUser = await this.liderUserRepository.update(ID, updateData)
    return { statusCode: HttpStatus.OK, updatedUser }
  }

  // POST
  // POST
  @Post('create')
  @HttpCode(201)
  async postUser(@Body() body: CreateUserBody) {
    const {
      channel_user,
      company_user,
      email_login_user,
      name_user,
      password_user,
      profile_user,
      status_user,
    } = body

    // Verifica se o email é nulo ou vazio
    if (!email_login_user) {
      throw new Error('Email não pode ser nulo ou vazio!')
    }

    // Verifica se o nome é nulo ou vazio
    if (!name_user) {
      throw new Error('Nome não pode ser nulo ou vazio!')
    }

    // Verifica se a senha é nula ou vazia
    if (!password_user) {
      throw new Error('Senha não pode ser nula ou vazia!')
    }

    // Verifica se o email já está cadastrado
    const existingUserByEmail =
      await this.liderUserRepository.findByEmail(email_login_user)
    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado!')
    }

    // Verifica se o nome já está cadastrado
    const existingUserByName =
      await this.liderUserRepository.findByName(name_user)
    if (existingUserByName) {
      throw new ConflictException('Nome já cadastrado!')
    }

    // Gera o hash da senha
    const hashedPassword = await hash(password_user, 8)

    // Cria o usuário
    await this.liderUserRepository.create(
      name_user,
      email_login_user,
      hashedPassword, // Use o password hasheado aqui
      channel_user || 0,
      profile_user || 0,
      status_user || '',
      company_user || '',
    )

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuário adicionado com sucesso!',
    }
  }
}
