import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateRepresentativeSchemaDto } from "features/representative/domain/dto/create-representative.dto";
import {
  CreateRepresentativeEntity,
  RepresentativeStatus,
} from "features/representative/domain/entity/create-representative.entity";
import {
  RepresentativeEntity,
  RepresentativeType,
} from "features/representative/domain/entity/representative.entity";
import { RepresentativeServiceTypes } from "features/representative/domain/services/representative.repositories";

@Injectable()
export class RepresentativePrismaService implements RepresentativeServiceTypes {
  constructor(private prisma: PrismaService) {}
  findById(id: number): Promise<RepresentativeEntity | null> {
    return this.prisma.representative.findUnique({
      where: { id },
    });
  }
  findall(): Promise<RepresentativeEntity[]> {
    return this.prisma.representative.findMany();
  }
  findByName(name: string): Promise<RepresentativeEntity | null> {
    return this.prisma.representative.findFirst({
      where: { name },
    });
  }
  async create(
    data: CreateRepresentativeSchemaDto
  ): Promise<CreateRepresentativeEntity> {
    if (
      !data.name ||
      !data.region ||
      !data.supervisor ||
      !data.status ||
      !data.type ||
      !data.commission ||
      !data.contact ||
      !data.address
    ) {
      throw new Error("Dados obrigatórios faltando");
    }

    const res = await this.prisma.representative.create({
      data: {
        name: data.name,
        region: data.region,
        supervisor: data.supervisor,
        status: data.status,
        type: data.type,
        cellphone: data.contact.cellphone,
        phone: data.contact.phone,
        commission: {
          create: {
            implantation: data.commission.implantation,
            mensality: data.commission.mensality,
          },
        },
        contact: {
          create: {
            cellphone: data.contact.cellphone,
            phone: data.contact.phone,
            email: data.contact.email,
          },
        },
        address: {
          create: {
            postal_code: data.address.postal_code,
            street: data.address.street,
            number: data.address.number,
            neighborhood: data.address.neighborhood,
            municipality_name: data.address.municipality_name,
            state: data.address.state,
          },
        },
        created_at: data.created_at || new Date(),
      },
    });

    return new CreateRepresentativeEntity({
      id: res.id,
      name: res.name,
      region: res.region,
      supervisor: res.supervisor,
      status: res.status as RepresentativeStatus,
      type: res.type as RepresentativeType,
      commission: data.commission,
      contact: data.contact,
      address: data.address,
      created_at: res.created_at,
    });
  }
  update(
    id: number,
    data: RepresentativeEntity
  ): Promise<RepresentativeEntity> {
    throw new Error("Method not implemented.");
  }
  async remove(id: number): Promise<void> {
    try {
      const representative = await this.prisma.representative.findUnique({
        where: { id },
        include: {
          commission: true,
          address: true,
          clients: true,
        },
      });

      if (!representative) {
        throw new Error("Representative not found");
      }

      await this.prisma.commission.deleteMany({
        where: { representativeId: id },
      });

      // Agora, exclua o representante
      await this.prisma.representative.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException("Error deleting representative");
    }
  }

  findByType(type: RepresentativeType): Promise<RepresentativeEntity[]> {
    throw new Error("Method not implemented.");
  }
}
