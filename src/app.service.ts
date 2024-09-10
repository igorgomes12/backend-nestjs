import { Injectable } from '@nestjs/common'
import { PrismaService } from './database/prisma.service'
import { CreateUserBody } from './dtos/create_user_body'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserBody) {
    try {
      return await this.prisma.user.create({
        data: {
          name_user: data.name_user || '',
          password_user: data.password_user || '',
          email_login_user: data.email_login_user || '',
          channel_user: data.channel_user || 0,
          profile_user: data.profile_user || 0,
          status_user: data.status_user || '',
          company_user: data.company_user || '',
        },
      })
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new Error('O e-mail já está em uso.')
      }
      throw error
    }
  }

  async findAllUsers() {
    return this.prisma.user.findMany()
  }
}
