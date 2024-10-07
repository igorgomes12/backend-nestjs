import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { TSchemaEstablished } from "features/establishment/domain/dto/create-establishment.dto";
import { EstablishmentEntity } from "features/establishment/domain/entity/establishment.entity";
import { EstablishmentTypeService } from "features/establishment/domain/services/establishment-type.sevice";

@Injectable()
export class EstablishmentPrismaService implements EstablishmentTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: TSchemaEstablished): Promise<EstablishmentEntity[]> {
    const establishments = await this.prisma.establishment_type.findMany({
      where: {
        name: params.name,
        status: params.status,
      },
    });

    return establishments.map(
      (establishment) =>
        new EstablishmentEntity({
          id: establishment.id,
          name: establishment.name,
          status: establishment.status,
        })
    );
  }

  async findById(id: number): Promise<EstablishmentEntity | null> {
    const establishment = await this.prisma.establishment_type.findUnique({
      where: { id },
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }

    return new EstablishmentEntity({
      id: establishment.id,
      name: establishment.name,
      status: establishment.status,
    });
  }

  async create(data: TSchemaEstablished): Promise<EstablishmentEntity> {
    const establishment = await this.prisma.establishment_type.create({
      data: {
        name: data.name,
        status: data.status,
      },
    });

    return new EstablishmentEntity({
      id: establishment.id,
      name: establishment.name,
      status: establishment.status,
    });
  }

  async update(
    id: number,
    data: Partial<EstablishmentEntity>
  ): Promise<EstablishmentEntity> {
    const updatedEstablishment = await this.prisma.establishment_type.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
      },
    });

    return new EstablishmentEntity({
      id: updatedEstablishment.id,
      name: updatedEstablishment.name,
      status: updatedEstablishment.status,
    });
  }

  async delete(id: number): Promise<void> {
    const establishment = await this.prisma.establishment_type.findUnique({
      where: { id },
    });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    await this.prisma.establishment_type.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<EstablishmentEntity | null> {
    const establishment = await this.prisma.establishment_type.findFirst({
      where: { name },
    });
    if (!establishment) {
      return null;
    }
    return new EstablishmentEntity({
      id: establishment.id,
      name: establishment.name,
      status: establishment.status,
    });
  }
}
