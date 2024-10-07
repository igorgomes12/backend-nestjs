import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from "@nestjs/common";
import { TSystemSchemaDto } from "../../../../../features/systems/domain/dto/system.dto";
import { Prisma } from "@prisma/client";
import { SystemRepository } from "features/systems/domain/services/system.repositories";

@Injectable()
export class SystemPrismaRepository implements SystemRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TSystemSchemaDto[]> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar sistemas.");
    }
  }

  async findOne(id: number): Promise<TSystemSchemaDto | null> {
    try {
      const system = await this.prisma.system.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          image_url: true,
          stable_version: true,
        },
      });

      if (!system) {
        throw new NotFoundException("Sistema não encontrado.");
      }

      return system;
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar sistema.");
    }
  }

  async findByName(name: string): Promise<TSystemSchemaDto | null> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erro ao buscar sistema pelo nome."
      );
    }
  }

  async findByVersion(version: string): Promise<TSystemSchemaDto | null> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        "Erro ao buscar sistema pela versão."
      );
    }
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

  async update(id: number, data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    try {
      return this.prisma.system.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          stable_version: data.stable_version,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao atualizar sistema.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.system.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: "Sistema removido com sucesso." };
    } catch (error) {
      throw new InternalServerErrorException("Erro ao remover sistema.");
    }
  }
}
