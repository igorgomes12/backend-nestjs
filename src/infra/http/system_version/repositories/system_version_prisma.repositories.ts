import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";
import { ISystemVersionRepository } from "../repositories/system_version.repositories";

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
        id: result.id,
        description: result.description,
        release_date: result.release_date,
        version: result.version_number,
        system_id: result.system_id,
      }));
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao buscar versões do sistema."
      );
    }
  }

  async findOne(id: number): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findUnique({
        where: { id },
        select: {
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });

      if (!result) {
        throw new NotFoundException("Versão do sistema não encontrada.");
      }

      return {
        description: result.description,
        release_date: result.release_date,
        version: result.version_number,
        system_id: result.system_id,
      };
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao buscar versão do sistema."
      );
    }
  }

  async findByName(name: string): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findFirst({
        where: { description: name, deletedAt: null },
        select: {
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });

      if (!result) {
        return null;
      }

      return {
        description: result.description,
        release_date: result.release_date,
        version: result.version_number,
        system_id: result.system_id,
      };
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao buscar versão do sistema pelo nome."
      );
    }
  }

  async findByVersion(
    version: string
  ): Promise<TSystemVersionSchemaDto | null> {
    try {
      const result = await this.prisma.system_Version.findFirst({
        where: { version_number: version, deletedAt: null },
        select: {
          description: true,
          release_date: true,
          version_number: true,
          system_id: true,
        },
      });

      if (!result) {
        return null;
      }

      return {
        description: result.description,
        release_date: result.release_date,
        version: result.version_number,
        system_id: result.system_id,
      };
    } catch (error) {
      console.error("Erro ao acessar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao buscar versão do sistema pela versão."
      );
    }
  }

  async create(
    data: Omit<TSystemVersionSchemaDto, "id" | "release_date">
  ): Promise<TSystemVersionSchemaDto> {
    try {
      const createdVersion = await this.prisma.system_Version.create({
        data: {
          version_number: data.version,
          description: data.description,
          system_id: data.system_id,
        },
      });

      const allSystems = await this.prisma.system.findMany();
      await Promise.all(
        allSystems.map((system) =>
          this.prisma.system.update({
            where: { id: system.id },
            data: { stable_version: data.version },
          })
        )
      );

      return {
        description: createdVersion.description,
        release_date: createdVersion.release_date,
        version: createdVersion.version_number,
        system_id: createdVersion.system_id,
      };
    } catch (error) {
      console.error("Erro ao criar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao criar versão do sistema."
      );
    }
  }

  async update(
    id: number,
    data: Omit<TSystemVersionSchemaDto, "id">
  ): Promise<TSystemVersionSchemaDto> {
    try {
      console.log(`Iniciando atualização da versão do sistema com ID: ${id}`);

      // Verificar se a versão do sistema existe
      const existingVersion = await this.prisma.system_Version.findUnique({
        where: { id },
      });

      if (!existingVersion) {
        console.error(`Versão do sistema com ID ${id} não encontrada.`);
        throw new NotFoundException("Versão do sistema não encontrada.");
      }

      // Atualizar a versão do sistema específico
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

      console.log(`Versão do sistema com ID ${id} atualizada com sucesso.`);

      // Atualizar a versão estável para todos os sistemas
      const allSystems = await this.prisma.system.findMany();
      await Promise.all(
        allSystems.map((system) =>
          this.prisma.system.update({
            where: { id: system.id },
            data: { stable_version: data.version },
          })
        )
      );

      console.log(`Versão estável atualizada para todos os sistemas.`);

      return {
        description: result.description,
        release_date: result.release_date,
        version: result.version_number,
        system_id: result.system_id,
      };
    } catch (error) {
      console.error("Erro ao atualizar system_Version:", error);
      throw new InternalServerErrorException(
        "Erro ao atualizar versão do sistema."
      );
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
      throw new InternalServerErrorException(
        "Erro ao remover versão do sistema."
      );
    }
  }
}
