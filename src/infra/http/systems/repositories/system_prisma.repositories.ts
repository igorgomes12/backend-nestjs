import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from "@nestjs/common";
import { TSystemSchemaDto } from "../dto/system.dto";
import { ISystemRepository } from "./system.repositories";
import { Prisma } from "@prisma/client";

@Injectable()
export class SystemRepository implements ISystemRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TSystemSchemaDto[]> {
    return this.prisma.system.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        stable_version: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: string): Promise<TSystemSchemaDto | null> {
    return this.prisma.system.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        stable_version: true,
      },
    });
  }

  async findByName(name: string): Promise<TSystemSchemaDto | null> {
    return this.prisma.system.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        stable_version: true,
      },
    });
  }

  async findByVersion(version: string): Promise<TSystemSchemaDto | null> {
    return this.prisma.system.findFirst({
      where: {
        stable_version: version,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        stable_version: true,
      },
    });
  }

  async create(data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    try {
      return await this.prisma.system.create({
        data: {
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          stable_version: data.stable_version,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new NotImplementedException(
            "Já existe um sistema com esse nome ou versão."
          );
        }
      }
      throw new InternalServerErrorException("Erro ao tentar criar sistema.");
    }
  }

  async update(id: string, data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    return this.prisma.system.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        stable_version: data.stable_version,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.prisma.system.delete({
      where: { id },
    });
    return { message: "Sistema removido com sucesso." };
  }
}
