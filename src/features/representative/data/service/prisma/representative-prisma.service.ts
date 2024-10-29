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
  async findById(id: number): Promise<RepresentativeEntity | null> {
    const result = await this.prisma.representative.findUnique({
      where: { id },
      include: {
        commission: true,
        address: true,
        clients: true,
      },
    });

    if (!result) {
      return null;
    }

    return new RepresentativeEntity({
      id: result.id,
      name: result.name,
      region: result.region,
      supervisor: result.supervisor,
      status: result.status as RepresentativeStatus,
      type: result.type as RepresentativeType,
      commission:
        result.commission.length > 0
          ? {
              implantation: result.commission[0].implantation,
              mensality: result.commission[0].mensality,
            }
          : undefined,
      address:
        result.address.length > 0
          ? {
              municipality_name: result.address[0].municipality_name,
              neighborhood: result.address[0].neighborhood,
              number: result.address[0].number,
              street: result.address[0].street,
              state: result.address[0].state,
              postal_code: result.address[0].postal_code,
            }
          : undefined,
      cellphone: result.cellphone,
      phone: result.phone,
    });
  }
  async findall(): Promise<RepresentativeEntity[]> {
    const results = await this.prisma.representative.findMany({
      include: {
        commission: true,
        address: true,
        clients: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return results.map(
      (result) =>
        new RepresentativeEntity({
          id: result.id,
          name: result.name,
          region: result.region,
          supervisor: result.supervisor,
          status: result.status as RepresentativeStatus,
          type: result.type as RepresentativeType,
          commission:
            result.commission.length > 0
              ? {
                  implantation: result.commission[0].implantation,
                  mensality: result.commission[0].mensality,
                }
              : undefined,
          address:
            result.address.length > 0
              ? {
                  municipality_name: result.address[0].municipality_name,
                  neighborhood: result.address[0].neighborhood,
                  number: result.address[0].number,
                  street: result.address[0].street,
                  state: result.address[0].state,
                  postal_code: result.address[0].postal_code,
                }
              : undefined,
          cellphone: result.cellphone,
          phone: result.phone,
        })
    );
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
        supervisor: data.supervisor || null,
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
  async update(
    id: number,
    data: RepresentativeEntity
  ): Promise<RepresentativeEntity> {
    try {
      const existingRepresentative =
        await this.prisma.representative.findUnique({
          where: { id },
        });

      if (!existingRepresentative) {
        throw new Error("Representative not found");
      }

      const updatedRepresentative = await this.prisma.representative.update({
        where: { id },
        data: {
          name: data.name,
          region: data.region,
          supervisor: data.supervisor,
          status: data.status as RepresentativeStatus,
          type: data.type as RepresentativeType,
          cellphone: data.cellphone,
          phone: data.phone,
          commission: data.commission
            ? {
                updateMany: {
                  where: { representativeId: id },
                  data: {
                    implantation: data.commission.implantation,
                    mensality: data.commission.mensality,
                  },
                },
              }
            : undefined,
          contact: data.contact
            ? {
                updateMany: {
                  where: { representativeId: id },
                  data: {
                    cellphone: data.contact.cellphone,
                    phone: data.contact.phone,
                    email: data.contact.email,
                  },
                },
              }
            : undefined,
          address: data.address
            ? {
                updateMany: {
                  where: { representativeId: id },
                  data: {
                    postal_code: data.address.postal_code,
                    street: data.address.street,
                    number: data.address.number,
                    neighborhood: data.address.neighborhood,
                    municipality_name: data.address.municipality_name,
                    state: data.address.state,
                  },
                },
              }
            : undefined,
        },
      });

      return updatedRepresentative;
    } catch (error) {
      throw new InternalServerErrorException("Error updating representative");
    }
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

      await this.prisma.representative.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException("Error deleting representative");
    }
  }

  async findByType(type: RepresentativeType): Promise<RepresentativeEntity[]> {
    try {
      return await this.prisma.representative.findMany({
        where: { type },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Error finding representatives by type"
      );
    }
  }
}
