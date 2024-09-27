import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotImplementedException,
} from "@nestjs/common";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { ISystemRepository } from "./system.repositories";
import { TSystemSchemaDto } from "../dto/system.dto";

@Injectable()
export class SystemRepository implements ISystemRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TSystemSchemaDto[]> {
    return this.prisma.systems.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
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

  async create(data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    try {
      return await this.prisma.systems.create({
        data: {
          name: data.name,
        },
      });
    } catch (error) {
      if (error === "P2002") {
        throw new NotImplementedException(
          "Já existe um sistema com esse nome."
        );
      }
      throw new InternalServerErrorException("Erro ao tentar criar sistema.");
    }
  }

  async update(id: number, data: TSystemSchemaDto): Promise<TSystemSchemaDto> {
    return this.prisma.systems.update({
      where: { id },
      data: { name: data.name },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.prisma.systems.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "Sistema removido com sucesso." };
  }
}
