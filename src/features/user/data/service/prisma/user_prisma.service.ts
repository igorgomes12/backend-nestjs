import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";

import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { CreateEntitiy } from "features/user/domain/entity/create.entity";
import { DeleteUserEntity } from "features/user/domain/entity/delete.entity";
import { UserEntitiy } from "features/user/domain/entity/user.entity";
import { UserService } from "features/user/domain/services/user.service";

export class UserPrismaService implements UserService {
  constructor(private service: PrismaService) {}
  async findAll(params: TCreateBodySchemaDto): Promise<UserEntitiy[]> {
    const data = await this.service.user.findMany({
      where: {
        name: params.name,
        email: params.email,
        status: params.status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        channel: true,
        status: true,
        profile: true,
      },
    });

    return data.map(
      (user) =>
        new UserEntitiy(
          user.name,
          user.email,
          user.profile.id,
          user.status,
          user.id
        )
    );
  }
  async findByEmail(email: string): Promise<UserEntitiy | null> {
    const data = await this.service.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
    if (!data) return null;
    return new UserEntitiy(
      data.name,
      data.email,
      data.profile.id,
      data.status,
      data.id
    );
  }
  async create(user: TCreateBodySchemaDto): Promise<CreateEntitiy> {
    try {
      const parsedData = createBodySchemaDto.parse(user);
      const createdUser = await this.service.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connect: { name: parsedData.profile },
          },
          status: parsedData.status,
          organization: parsedData.organization,
        },
      });

      return new CreateEntitiy(
        createdUser.name,
        createdUser.email,
        createdUser.password,
        createdUser.channel,
        createdUser.profileId.toString(),
        createdUser.status,
        createdUser.organization
      );
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }
  update(user_id: number, user: User): Promise<UserEntitiy> {
    throw new Error("Method not implemented.");
  }

  async findById(userId: number): Promise<DeleteUserEntity | null> {
    return this.service.user.findUnique({
      where: { id: userId },
    });
  }
  async delete(id: number) {
    try {
      await this.service.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao deletar usuário");
    }
  }
  findByName(name: string): Promise<UserEntitiy | null> {
    throw new Error("Method not implemented.");
  }
}
