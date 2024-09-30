import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  schemaEstablished,
  type SchemaEstablished,
} from "@infra/http/establishment/dto/create-establishment.dto";
import { Establishment } from "@common/domain/entities/entities_establishment/establishment.entity";

type FilterConditions = {
  status?: boolean;
  name?: {
    contains: string;
    mode: "insensitive";
  };
  id?: number;
};

@Injectable()
export class EstablishmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: SchemaEstablished) {
    const { name, status } = schemaEstablished.parse(body);

    if (name.length < 1) {
      throw new BadRequestException("Nome inválido");
    }

    const existingEstablishment =
      await this.prisma.establishment_type.findUnique({
        where: { name },
      });

    if (existingEstablishment) {
      throw new BadRequestException("Nome já cadastrado");
    }
    const establishmentStatus = status !== undefined ? status : true;

    try {
      const establishment = await this.prisma.establishment_type.create({
        data: {
          name: body.name.toLocaleUpperCase(),
          status: establishmentStatus,
        },
      });

      return establishment;
    } catch (error) {
      throw new InternalServerErrorException("Erro ao criar estabelecimento");
    }
  }

  async findAll(): Promise<Establishment[]> {
    const establishments = await this.prisma.establishment_type.findMany({
      orderBy: { id: "asc" },
    });
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
      const existingEstablishment =
        await this.prisma.establishment_type.findUnique({
          where: { id },
        });

      if (!existingEstablishment) {
        throw new NotFoundException(`Establishment with ID ${id} not found.`);
      }

      if (updateEstablishmentDto.name) {
        const nameExists = await this.prisma.establishment_type.findUnique({
          where: { name: updateEstablishmentDto.name },
        });

        if (nameExists && nameExists.id !== id) {
          throw new BadRequestException(
            `O nome inserido ${updateEstablishmentDto.name} já existe!`
          );
        }
      }

      const updatedEstablishment = await this.prisma.establishment_type.update({
        where: { id },
        data: {
          name: updateEstablishmentDto.name,
          status: updateEstablishmentDto.status,
        },
      });

      return [new Establishment(updatedEstablishment)];
    } catch (error) {
      console.error("Error trying to update the establishment:", error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error === "P2002") {
        throw new BadRequestException(
          `Establishment with name ${updateEstablishmentDto.name} already exists.`
        );
      }

      throw new InternalServerErrorException(
        "Error trying to update the establishment."
      );
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.establishment_type.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        `O estabelecimento com ID ${id} já foi excluído.`
      );
    }
  }

  async filter({
    status,
    name,
    id,
  }: {
    status?: boolean;
    name?: string;
    id?: number;
  }): Promise<Establishment[]> {
    const filterConditions: FilterConditions = {};

    if (status !== undefined) {
      filterConditions.status = status;
    }

    if (name) {
      filterConditions.name = { contains: name, mode: "insensitive" };
    }

    if (id) {
      filterConditions.id = id;
    }

    const establishments = await this.prisma.establishment_type.findMany({
      where: filterConditions,
      orderBy: { id: "asc" },
    });

    return establishments.map(
      (establishment) => new Establishment(establishment)
    );
  }
}
