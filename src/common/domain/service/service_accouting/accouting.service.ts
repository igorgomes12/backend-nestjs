import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  AccountingSchema,
  TAccountingSchema,
} from "@infra/http/accouting/dto/accounting_zod";
import {
  AccoutingEntities,
  type TOutput,
} from "@common/domain/entities/entities_accounting/accouting.entity";

@Injectable()
export class AccoutingService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: TAccountingSchema) {
    const { name, cnpj, contact, crc, email, phone } =
      AccountingSchema.parse(data);

    if (name.length < 1) {
      throw new BadRequestException("Nome inválido");
    }

    const [existingName, existingAccouting, existingEmail] = await Promise.all([
      this.prisma.accounting.findFirst({ where: { name } }),
      this.prisma.accounting.findFirst({ where: { cnpj } }),
      this.prisma.accounting.findFirst({ where: { email } }),
    ]);

    const errors = {
      existingName: "Nome já cadastrado",
      existingAccouting: "CNPJ já cadastrado",
      existingEmail: "E-mail já cadastrado",
    };

    for (const [key, message] of Object.entries(errors)) {
      if (eval(key)) {
        throw new BadRequestException(message);
      }
    }

    try {
      const account = await this.prisma.accounting.create({
        data: {
          name,
          cnpj,
          contact,
          crc,
          email,
          phone,
        },
      });
      return account;
    } catch (error) {
      console.error("Erro ao criar contabilidade:", error);
      throw new InternalServerErrorException("Erro ao criar contabilidade");
    }
  }

  async findAll(): Promise<AccoutingEntities[]> {
    const account = await this.prisma.accounting.findMany({
      orderBy: { id: "asc" },
    });
    return account.map((accouting) => new AccoutingEntities(accouting));
  }

  async update(
    id: number,
    data: Partial<TAccountingSchema>
  ): Promise<AccoutingEntities[]> {
    try {
      const existingAccouting = await this.prisma.accounting.findUnique({
        where: { id },
      });
      if (!existingAccouting) {
        throw new NotFoundException(`Accouting with ID ${id} not found.`);
      }
      const updatedAccouting = await this.prisma.accounting.update({
        where: { id },
        data: {
          name: data.name,
          cnpj: data.cnpj,
          contact: data.contact,
          crc: data.crc,
          email: data.email,
          phone: data.phone,
        },
      });
      return [new AccoutingEntities(updatedAccouting)];
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error === "P2002") {
        throw new BadRequestException(
          `accounting with name ${data.name} already exists.`
        );
      }

      throw new InternalServerErrorException(
        "Error trying to update the accounting."
      );
    }
  }

  async remove(id: number) {
    const account = await this.prisma.accounting.findFirst({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`O ${id} não foi encontrado`);
    }
    try {
      const del = await this.prisma.accounting.delete({ where: { id } });
      return del;
    } catch (error) {
      throw new NotFoundException(`O ${id} não foi encontrado`);
    }
  }

  async filter({
    id,
    name,
    cnpj,
    contact,
    crc,
    email,
    phone,
  }: TOutput): Promise<AccoutingEntities[]> {
    const account = await this.prisma.accounting.findMany({
      where: {
        AND: [
          id ? { id } : {},
          name ? { name: { contains: name, mode: "insensitive" } } : {},
          cnpj ? { cnpj: { contains: cnpj, mode: "insensitive" } } : {},
          contact
            ? { contact: { contains: contact, mode: "insensitive" } }
            : {},
          crc ? { crc: { contains: crc, mode: "insensitive" } } : {},
          email ? { email: { contains: email, mode: "insensitive" } } : {},
          phone ? { phone: { contains: phone, mode: "insensitive" } } : {},
        ],
      },
      orderBy: { id: "asc" },
    });
    return account.map((accouting) => new AccoutingEntities(accouting));
  }
}
