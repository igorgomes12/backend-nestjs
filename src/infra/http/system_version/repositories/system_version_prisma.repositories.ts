import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ISystemVersionRepository } from "../repositories/system_version.repositories";
import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";
import { Injectable } from "@nestjs/common";
import { validate as isUuid } from "uuid";

@Injectable()
export class SystemVersionPrismaRepositories
  implements ISystemVersionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TSystemVersionSchemaDto[]> {
    try {
      const results = await this.prisma.system_Version.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });
      return results.map((result) => ({
        ...result,
        id: result.id.toString(),
      }));
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw error;
    }
  }

  async findOne(id: number): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findUnique({
        where: { id },
        select: {
          id: true,
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });
      return result ? { ...result, id: result.id.toString() } : null;
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw error;
    }
  }
  async create(
    data: TSystemVersionSchemaDto
  ): Promise<TSystemVersionSchemaDto> {
    if (!data.system_id) {
      throw new Error(`Invalid system_id: ${data.system_id}`);
    }

    // Remova ou ajuste a validação de UUID se não for necessária
    if (!isUuid(data.system_id)) {
      throw new Error(`Invalid system_id: ${data.system_id}`);
    }

    const createdVersion = await this.prisma.system_Version.create({
      data: {
        version_number: data.version,
        description: data.description,
        release_date: new Date(data.release_date),
        system_id: data.system_id,
      },
    });

    return {
      id: createdVersion.id.toString(),
      system_id: createdVersion.system_id,
      version: createdVersion.version_number,
      description: createdVersion.description,
      release_date: createdVersion.release_date,
    };
  }
  async findByName(name: string): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findFirst({
        where: { description: name, deletedAt: null },
        select: {
          id: true,
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });
      return result ? { ...result, id: result.id.toString() } : null;
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw error;
    }
  }

  async findByVersion(
    version: string
  ): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findFirst({
        where: { version_number: version, deletedAt: null },
        select: {
          id: true,
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });
      return result ? { ...result, id: result.id.toString() } : null;
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw error;
    }
  }

  async update(
    id: number,
    data: TSystemVersionSchemaDto
  ): Promise<TSystemVersionSchemaDto> {
    try {
      const result = await this.prisma.system_Version.update({
        where: { id },
        data: {
          description: data.description,
          release_date: data.release_date,
          version_number: data.version,
          system_id: data.system_id,
        },
        select: {
          id: true,
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });
      return { ...result, id: result.id.toString() };
    } catch (error) {
      console.error("Erro ao atualizar system_Version:", error);
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.system_Version.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: "Versão do sistema removida com sucesso." };
    } catch (error) {
      console.error("Erro ao remover system_Version:", error);
      throw error;
    }
  }
}
