import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { customerVersionSchemaDto } from "./dto/zod_customer.dto";
import { TInput, TOutput } from "./entities/customer_version.entity";
import { System } from "@prisma/client";

@Injectable()
export class CustomerVersionService {
  constructor(private prisma: PrismaService) {}

  async create(input: TInput): Promise<TOutput> {
    try {
      const validatedInput = customerVersionSchemaDto
        .pick({
          customer_id: true,
          system_id: true,
          version: true,
          assigned_date: true,
        })
        .parse(input);

      const newRecord = await this.prisma.customer_System_Version.create({
        data: {
          customer_id: validatedInput.customer_id,
          system_id: validatedInput.system_id,
          version: validatedInput.version,
          assigned_date: validatedInput.assigned_date,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Atualizar a versão estável do sistema
      await this.prisma.system.update({
        where: { id: validatedInput.system_id },
        data: { stable_version: validatedInput.version },
      });

      return {
        id: newRecord.id,
        customer_id: newRecord.customer_id,
        system_id: newRecord.system_id,
        version: newRecord.version,
        assigned_date: newRecord.assigned_date,
        createdAt: newRecord.createdAt,
        updatedAt: newRecord.updatedAt,
        deletedAt: newRecord.deletedAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar a versão!"
      );
    }
  }
  async findAll(): Promise<TOutput[]> {
    try {
      const records = await this.prisma.customer_System_Version.findMany({
        include: {
          system: true,
        },
      });

      return records.map((record) => ({
        id: record.id,
        customer_id: record.customer_id,
        system_id: record.system_id,
        version: record.version,
        assigned_date: record.assigned_date,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        deletedAt: record.deletedAt,
      }));
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar CustomerVersions");
    }
  }

  async findOne(id: number): Promise<TOutput | undefined> {
    try {
      const record = await this.prisma.customer_System_Version.findUnique({
        where: { id },
        include: {
          system: true,
        },
      });

      if (!record) {
        throw new NotFoundException(
          `CustomerVersion com ID ${id} não encontrado`
        );
      }

      return {
        id: record.id,
        customer_id: record.customer_id,
        system_id: record.system_id,
        version: record.version,
        assigned_date: record.assigned_date,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        deletedAt: record.deletedAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar CustomerVersion com ID ${id}`
      );
    }
  }

  async findById(system_id: number): Promise<System | null> {
    return this.prisma.system.findUnique({
      where: { id: system_id },
    });
  }

  async findBySystemIdAndVersion(
    system_id: number,
    version: string
  ): Promise<TOutput | null> {
    return this.prisma.customer_System_Version.findFirst({
      where: {
        system_id,
        version,
      },
    });
  }

  async update(
    id: number,
    input: Partial<TInput>
  ): Promise<TOutput | undefined> {
    try {
      const existingRecord =
        await this.prisma.customer_System_Version.findUnique({
          where: { id },
        });

      if (!existingRecord) {
        throw new NotFoundException(
          `CustomerVersion com ID ${id} não encontrado`
        );
      }
      const validatedInput = customerVersionSchemaDto.partial().parse(input);
      const updatedRecord = await this.prisma.customer_System_Version.update({
        where: { id },
        data: {
          ...validatedInput,
          updatedAt: new Date(),
        },
        include: {
          system: true,
        },
      });

      await this.prisma.system.update({
        where: { id: validatedInput.system_id },
        data: { stable_version: validatedInput.version },
      });

      return {
        id: updatedRecord.id,
        customer_id: updatedRecord.customer_id,
        system_id: updatedRecord.system_id,
        version: updatedRecord.version,
        assigned_date: updatedRecord.assigned_date,
        createdAt: updatedRecord.createdAt,
        updatedAt: updatedRecord.updatedAt,
        deletedAt: updatedRecord.deletedAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível atualizar a versão com ID ${id}`
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.prisma.customer_System_Version.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível remover a versão com ID ${id}`
      );
    }
  }
}
