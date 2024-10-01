import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { customerVersionSchemaDto } from "./dto/zod_customer.dto";
import { TInput, TOutput } from "./entities/customer_version.entity";

@Injectable()
export class CustomerVersionService {
  private readonly logger = new Logger(CustomerVersionService.name);

  constructor(private prisma: PrismaService) {}

  async create(input: TInput): Promise<TOutput> {
    this.logger.log("Iniciando criação de CustomerVersion", input);
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

      this.logger.log("CustomerVersion criado com sucesso", newRecord);

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
      this.logger.error("Erro ao criar CustomerVersion", error);
      throw new InternalServerErrorException(
        "Não foi possível criar a versão!"
      );
    }
  }

  async findAll(): Promise<TOutput[]> {
    this.logger.log("Iniciando busca de todos os CustomerVersions");
    try {
      const records = await this.prisma.customer_System_Version.findMany({
        include: {
          system: true,
        },
      });

      this.logger.log("CustomerVersions encontrados com sucesso", records);

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
      this.logger.error("Erro ao buscar todos os CustomerVersions", error);
      throw new InternalServerErrorException("Erro ao buscar CustomerVersions");
    }
  }

  async findOne(id: number): Promise<TOutput | undefined> {
    this.logger.log(`Iniciando busca do CustomerVersion com ID ${id}`);
    try {
      const record = await this.prisma.customer_System_Version.findUnique({
        where: { id },
        include: {
          system: true,
        },
      });

      if (!record) {
        this.logger.log(`CustomerVersion com ID ${id} não encontrado`);
        throw new NotFoundException(
          `CustomerVersion com ID ${id} não encontrado`
        );
      }

      this.logger.log(
        `CustomerVersion com ID ${id} encontrado com sucesso`,
        record
      );

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
      this.logger.error(`Erro ao buscar CustomerVersion com ID ${id}`, error);
      throw new InternalServerErrorException(
        `Erro ao buscar CustomerVersion com ID ${id}`
      );
    }
  }

  async update(
    id: number,
    input: Partial<TInput>
  ): Promise<TOutput | undefined> {
    this.logger.log(
      `Iniciando atualização de CustomerVersion com ID ${id}`,
      input
    );
    try {
      const existingRecord =
        await this.prisma.customer_System_Version.findUnique({
          where: { id },
        });

      if (!existingRecord) {
        this.logger.log(
          `CustomerVersion com ID ${id} não encontrado para atualização`
        );
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

      this.logger.log(
        `CustomerVersion com ID ${id} atualizado com sucesso`,
        updatedRecord
      );

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
      this.logger.error(
        `Erro ao atualizar CustomerVersion com ID ${id}`,
        error
      );
      throw new InternalServerErrorException(
        `Não foi possível atualizar a versão com ID ${id}`
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    this.logger.log(`Iniciando remoção de CustomerVersion com ID ${id}`);
    try {
      await this.prisma.customer_System_Version.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      this.logger.log(`CustomerVersion com ID ${id} removido com sucesso`);

      return true;
    } catch (error) {
      this.logger.error(`Erro ao remover CustomerVersion com ID ${id}`, error);
      throw new InternalServerErrorException(
        `Não foi possível remover a versão com ID ${id}`
      );
    }
  }
}
