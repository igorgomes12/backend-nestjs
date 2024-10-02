import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  CustomerVersion,
  TInput,
} from "@common/domain/entities/entities_customer_system/customer_version.entity";
import { ICustomerSystemVersionRepositoryTypes } from "./customer_system_version_types.repositories";
import {
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

@Injectable()
export class CustomerSystemVersionRepositories
  implements ICustomerSystemVersionRepositoryTypes
{
  constructor(private readonly prisma: PrismaService) {}

  async findBySystemIdAndVersion(
    system_id: number,
    version: string
  ): Promise<CustomerVersion | null> {
    try {
      const result = await this.prisma.customer_System_Version.findFirst({
        where: { system_id, version, deletedAt: null },
        include: {
          system: true,
        },
      });

      if (!result) {
        return null;
      }

      return new CustomerVersion({
        id: result.id,
        customer_id: result.customer_id,
        system_id: result.system_id,
        version: result.version,
        assigned_date: result.assigned_date,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });
    } catch (error) {
      throw new NotFoundException(
        `Erro ao buscar CustomerVersion com system_id ${system_id} e versão ${version}`
      );
    }
  }

  async findAll(): Promise<CustomerVersion[]> {
    try {
      const results = await this.prisma.customer_System_Version.findMany({
        where: { deletedAt: null },
        include: {
          system: true,
        },
      });

      return results.map(
        (result) =>
          new CustomerVersion({
            id: result.id,
            customer_id: result.customer_id,
            system_id: result.system_id,
            version: result.version,
            assigned_date: result.assigned_date,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            deletedAt: result.deletedAt,
          })
      );
    } catch (error) {
      throw new NotFoundException("Erro ao buscar CustomerVersions");
    }
  }

  async findOne(id: number): Promise<CustomerVersion | null> {
    try {
      const result = await this.prisma.customer_System_Version.findUnique({
        where: { id, deletedAt: null },
        include: {
          system: true,
        },
      });

      if (!result) {
        throw new NotFoundException(
          `CustomerVersion com ID ${id} não encontrado`
        );
      }
      return new CustomerVersion({
        id: result.id,
        customer_id: result.customer_id,
        system_id: result.system_id,
        version: result.version,
        assigned_date: result.assigned_date,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });
    } catch (error) {
      throw new NotFoundException(
        `Erro ao buscar CustomerVersion com ID ${id}`
      );
    }
  }

  async findByVersion(version: string): Promise<CustomerVersion | null> {
    try {
      const result = await this.prisma.customer_System_Version.findFirst({
        where: { version: version, deletedAt: null },
        include: {
          system: true,
        },
      });

      if (!result) {
        throw new NotFoundException(
          `CustomerVersion com versão ${version} não encontrado`
        );
      }

      return new CustomerVersion({
        id: result.id,
        customer_id: result.customer_id,
        system_id: result.system_id,
        version: result.version,
        assigned_date: result.assigned_date,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });
    } catch (error) {
      throw new NotFoundException(
        `Erro ao buscar CustomerVersion com versão ${version}`
      );
    }
  }

  async create(data: TInput): Promise<CustomerVersion> {
    try {
      const system = await this.prisma.system.findUnique({
        where: { id: data.system_id },
      });

      if (!system) {
        throw new NotFoundException(
          `Sistema com ID ${data.system_id} não encontrado`
        );
      }

      const createdVersion = await this.prisma.customer_System_Version.create({
        data: {
          customer_id: data.customer_id,
          system_id: data.system_id,
          version: data.version,
          assigned_date: data.assigned_date,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await this.prisma.system.update({
        where: { id: data.system_id },
        data: { stable_version: data.version },
      });

      return new CustomerVersion({
        id: createdVersion.id,
        customer_id: createdVersion.customer_id,
        system_id: createdVersion.system_id,
        version: createdVersion.version,
        assigned_date: createdVersion.assigned_date,
        createdAt: createdVersion.createdAt,
        updatedAt: createdVersion.updatedAt,
        deletedAt: createdVersion.deletedAt,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar a versão!"
      );
    }
  }

  async update(id: number, data: TInput): Promise<CustomerVersion> {
    try {
      const system = await this.prisma.system.findUnique({
        where: { id: data.system_id },
      });

      if (!system) {
        throw new NotFoundException(
          `Sistema com ID ${data.system_id} não encontrado`
        );
      }

      const result = await this.prisma.customer_System_Version.update({
        where: { id },
        data: {
          customer_id: data.customer_id,
          system_id: data.system_id,
          version: data.version,
          assigned_date: data.assigned_date,
          updatedAt: new Date(),
        },
      });

      await this.prisma.system.update({
        where: { id: data.system_id },
        data: { stable_version: data.version },
      });

      return new CustomerVersion({
        id: result.id,
        customer_id: result.customer_id,
        system_id: result.system_id,
        version: result.version,
        assigned_date: result.assigned_date,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });
    } catch (error) {
      throw new NotFoundException(
        `Não foi possível atualizar a versão com ID ${id}`
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.customer_System_Version.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return { message: "CustomerVersion removido com sucesso" };
    } catch (error) {
      throw new NotFoundException(
        `Não foi possível remover a versão com ID ${id}`
      );
    }
  }
}
