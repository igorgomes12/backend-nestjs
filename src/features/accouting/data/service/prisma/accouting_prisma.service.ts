import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { InternalServerErrorException } from "@nestjs/common";
import { TAccountingSchema } from "features/accouting/domain/dto/accounting_zod";
import { AccountingFindAllEntity } from "features/accouting/domain/entity/accouting-findAll.entity";
import { AccoutingServiceMethods } from "features/accouting/domain/services/accouting.service";

export class AccoutingPrismaService implements AccoutingServiceMethods {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: TAccountingSchema): Promise<AccountingFindAllEntity[]> {
    const data = this.prisma.accounting.findMany({
      where: {
        name: params.name,
        cnpj: params.cnpj,
        contact: params.contact,
        crc: params.crc,
        email: params.email,
        phone: params.phone,
      },
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        cnpj: true,
        contact: true,
        crc: true,
        email: true,
        phone: true,
      },
    });

    return data;
  }
  findById(user_id: number): Promise<AccountingFindAllEntity | null> {
    const data = this.prisma.accounting.findUnique({
      where: { id: user_id },
    });
    return data;
  }
  findByEmail(email: string): Promise<AccountingFindAllEntity | null> {
    const data = this.prisma.accounting.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        cnpj: true,
        contact: true,
        crc: true,
        email: true,
        phone: true,
      },
    });

    return data;
  }
  create(user: TAccountingSchema): Promise<AccountingFindAllEntity> {
    const data = this.prisma.accounting.create({
      data: {
        name: user.name,
        cnpj: user.cnpj,
        contact: user.contact,
        crc: user.crc,
        email: user.email,
        phone: user.phone,
      },
    });

    return data;
  }
  update(
    user_id: number,
    user: Partial<AccountingFindAllEntity>
  ): Promise<AccountingFindAllEntity> {
    const data = this.prisma.accounting.update({
      where: { id: user_id },
      data: {
        name: user.name,
        cnpj: user.cnpj,
        contact: user.contact,
        crc: user.crc,
        email: user.email,
        phone: user.phone,
      },
    });

    return data;
  }
  async delete(user_id: number) {
    try {
      await this.prisma.accounting.delete({
        where: { id: user_id },
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao deletar usuário");
    }
  }
  findByName(name: string): Promise<AccountingFindAllEntity | null> {
    const data = this.prisma.accounting.findFirst({
      where: { name: name },
    });
    return data;
  }
}
