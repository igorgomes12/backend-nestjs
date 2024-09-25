import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Establishment } from "./entities/establishment.entity";
import type { SchemaEstablished } from "./dto/create-establishment.dto";

@Injectable()
export class EstablishmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEstablishmentDto: SchemaEstablished) {
    try {
      const establishment = await this.prisma.establishment_type.create({
        data: {
          name: createEstablishmentDto.name,
          status: createEstablishmentDto.status,
        },
      });

      return establishment;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Establishment[]> {
    const establishments = await this.prisma.establishment_type.findMany();
    return establishments.map(
      (establishment) => new Establishment(establishment)
    );
  }

  async findOne(id: number): Promise<Establishment> {
    const establishment = await this.prisma.establishment_type.findUnique({
      where: { id },
    });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return new Establishment(establishment);
  }

  async update(
    id: number,
    updateEstablishmentDto: Partial<SchemaEstablished>
  ): Promise<Establishment[]> {
    try {
      const updatedEstablishment = await this.prisma.establishment_type.update({
        where: { id },
        data: {
          ...(updateEstablishmentDto.name && {
            name: updateEstablishmentDto.name,
          }),
          ...(updateEstablishmentDto.status !== undefined && {
            status: updateEstablishmentDto.status,
          }),
        },
      });

      return [new Establishment(updatedEstablishment)];
    } catch (error) {
      console.error("Error trying to update the establishment:", error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error === "P2025") {
        throw new NotFoundException(`Establishment with ID ${id} not found.`);
      }

      throw new InternalServerErrorException(
        "Error trying to update the establishment."
      );
    }
  }

  async remove(id: number) {
    console.log("id => ", id);
    try {
      await this.prisma.establishment_type.delete({
        where: { id },
      });
    } catch (error) {
      console.log("Error trying to remove the establishment:", error);
    }
  }
}
