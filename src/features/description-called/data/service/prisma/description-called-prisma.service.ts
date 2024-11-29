import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { DescriptionCalledService } from "features/description-called/domain/services/description-called.service";
import { TDescriptionCalledSchema } from "features/description-called/domain/dto/description-called-dto";
import { DescriptionCalledEntity } from "features/description-called/domain/entity/description-called-entity";

@Injectable()
export class DescriptionCalledPrismaService extends DescriptionCalledService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: number): Promise<DescriptionCalledEntity> {
    const value = await this.prisma.descriptionCalled.findUnique({
      where: { id: id },
    });

    if (!value) {
      throw new NotFoundException(`Chamado com ID ${id} não encontrado`);
    }
    return new DescriptionCalledEntity({
      id: value.id,
      description: value.description,
    });
  }

  async findAll(): Promise<DescriptionCalledEntity[]> {
    const data = await this.prisma.descriptionCalled.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return data.map(
      (item) =>
        new DescriptionCalledEntity({
          id: item.id,
          public_id: item.public_id,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
        })
    );
  }

  async create(data: {
    description: string;
  }): Promise<DescriptionCalledEntity> {
    const created = await this.prisma.descriptionCalled.create({
      data: {
        description: data.description,
      },
    });
    return new DescriptionCalledEntity({
      id: created.id,
      public_id: created.public_id,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt,
    });
  }

  async update(
    id: number,
    data: Partial<Omit<TDescriptionCalledSchema, "id">>
  ): Promise<DescriptionCalledEntity> {
    const updated = await this.prisma.descriptionCalled.update({
      where: { id },
      data: {
        description: data.description,
      },
    });
    return new DescriptionCalledEntity({
      id: updated.id,
      public_id: updated.public_id,
      description: updated.description,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      deletedAt: updated.deletedAt,
    });
  }

  async delete(id: number): Promise<void> {
    const value = await this.prisma.descriptionCalled.findUnique({
      where: { id },
    });
    if (!value) {
      throw new NotFoundException(`Chamado com ID ${id} não encontrado`);
    }
    await this.prisma.descriptionCalled.delete({
      where: { id },
    });
  }
}
