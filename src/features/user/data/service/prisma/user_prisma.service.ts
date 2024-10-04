import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { InternalServerErrorException } from "@nestjs/common";

import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { CreateEntitiy } from "features/user/domain/entity/create.entity";
import { DeleteUserEntity } from "features/user/domain/entity/delete.entity";
import { UpdateserEntity } from "features/user/domain/entity/update.entity";
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
      orderBy: {
        id: "asc",
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

      let profile = await this.service.profile.findUnique({
        where: { name: parsedData.profile },
      });

      if (!profile) {
        profile = await this.service.profile.create({
          data: {
            name: parsedData.profile,
          },
        });
      }

      const createdUser = await this.service.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connect: { id: profile.id },
          },
          status: parsedData.status,
          organization: parsedData.organization,
        },
      });
      if (!createdUser)
        throw new Error("Falha ao criar usuário, não tem usuário cadastrado");

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
      throw new Error("Falha ao criar usuário");
    }
  }
  async update(
    userId: number,
    updateData: Partial<UpdateserEntity>
  ): Promise<UpdateserEntity> {
    return this.service.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateData.name,
        email: updateData.email,
        password: updateData.password,
        channel: updateData.channel,
        status: updateData.status,
        organization: updateData.organization,
      },
    });
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
  async findByName(name: string): Promise<UpdateserEntity | null> {
    return await this.service.user.findFirst({
      where: { name },
    });
  }
}
