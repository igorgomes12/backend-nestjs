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
    return this.prisma.systems.findMany({
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

  async findOne(id: number): Promise<TSystemSchemaDto | null> {
    return this.prisma.systems.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByName(name: string): Promise<TSystemSchemaDto | null> {
    return this.prisma.systems.findUnique({
      where: { name, deletedAt: null },
      select: { id: true, name: true },
    });
  }
  async findByVersion(version: string): Promise<TSystemSchemaDto | null> {
    return this.prisma.systems.findFirst({
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
      return await this.prisma.systems.create({
        data: {
          name: data.name,
          description: data.description,
          image_url: data.imagem_url,
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

  async update(id: number, data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    return this.prisma.systems.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image_url: data.imagem_url,
        stable_version: data.stable_version,
      },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.prisma.systems.delete({
      where: { id },
    });
    return { message: "Sistema removido com sucesso." };
  }
}
