import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

import {
  createBodySchemaDto,
  TCreateBodySchemaDto,
} from "features/user/domain/dto/create_body.dto";
import { UpdateserEntity } from "features/user/domain/entity/update.entity";
import { UserEntity } from "features/user/domain/entity/user.entity";
import { UserMapper } from "features/user/domain/mappers/user-mapper";
import { UserService } from "features/user/domain/services/user.service";

export class UserPrismaService implements UserService {
  constructor(private service: PrismaService) {}
  async findAll(params: TCreateBodySchemaDto): Promise<UserEntity[]> {
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
        new UserEntity(
          user.name,
          user.email,
          user.profile.id,
          user.status,
          user.id
        )
    );
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const data = await this.service.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
    if (!data) return null;
    return new UserEntity(
      data.name,
      data.email,
      data.profile.id,
      data.status,
      data.id
    );
  }
  async create(user: TCreateBodySchemaDto): Promise<void> {
    try {
      const parsedData = createBodySchemaDto.parse(user);

      const profileMap = {
        ADMIN: 1,
        FINANCE: 2,
        REPRESENTATIVE: 3,
        REPRESENTATIVE_SUPERVISOR: 4,
        PROGRAMMING: 5,
        PROGRAMMING_SUPERVISOR: 6,
        SUPPORT: 7,
        SUPPORT_SUPERVISOR: 8,
      };

      const profileId = profileMap[parsedData.profile];

      if (!profileId) {
        throw new Error(`Perfil inválido: ${parsedData.profile}`);
      }

      const createdUser = await this.service.user.create({
        data: {
          name: parsedData.name,
          password: parsedData.password,
          email: parsedData.email,
          channel: parsedData.channel || 0,
          profile: {
            connectOrCreate: {
              where: { id: profileId },
              create: { id: profileId, name: parsedData.profile },
            },
          },
          status: parsedData.status,
          organization: parsedData.organization,
        },
      });

      if (!createdUser) {
        throw new Error("Falha ao criar usuário, não tem usuário cadastrado");
      }
    } catch (error) {
      throw new Error("Falha ao criar usuário: " + error);
    }
  }
  async update(
    userId: number,
    updateData: Partial<UpdateserEntity>
  ): Promise<UpdateserEntity> {
    await this._get(userId);
    return this.service.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateData.name,
        email: updateData.email,
        password: updateData.password,
        status: updateData.status,
      },
    });
  }

  async findById(id: number): Promise<UserEntity> {
    return this._get(id);
  }
  async delete(id: number): Promise<void> {
    await this._get(id);
    await this.service.user.delete({
      where: {
        id,
      },
    });
  }
  async findByName(name: string): Promise<UpdateserEntity | null> {
    return await this.service.user.findFirst({
      where: { name },
    });
  }

  protected async _get(id: number): Promise<UserEntity> {
    try {
      const user = await this.service.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException("Usuário não encontrado");
      }

      return UserMapper.toEntity(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  }
}
