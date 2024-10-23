import { formatCNPJ } from "@common/utils/regex/cpnj";
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { TAccountingSchema } from "../dto/accounting_zod";
import { AccoutingServiceMethods } from "../services/accouting.service";

export class CreateAccountingUseCase {
  constructor(
    @Inject("AccoutingServiceMethods")
    private readonly service: AccoutingServiceMethods
  ) {}

  async execute(data: TAccountingSchema) {
    const { email, name, cnpj, contact, crc, phone } = data;

    const existingNameAccount = await this.service.findByName(name);
    if (existingNameAccount) {
      throw new BadRequestException("Nome já existente");
    }

    const existingEmailAccount = await this.service.findByEmail(email);
    if (existingEmailAccount) {
      throw new BadRequestException("E-mail já existente");
    }

    if (cnpj.replace(/[^\d]+/g, "").length !== 14) {
      throw new BadRequestException(
        "CNPJ inválido. Deve conter 14 dígitos. Ex: 00.000.000/0000-00"
      );
    }

    const existingCNPJAccount = await this.service.findByCNPJ(cnpj);
    if (existingCNPJAccount) {
      throw new BadRequestException("CNPJ já existente");
    }

    const formattedCNPJ = formatCNPJ(cnpj);

    try {
      const result = await this.service.create({
        email,
        name,
        cnpj: formattedCNPJ,
        contact,
        crc,
        phone,
      });

      if (!result) {
        throw new InternalServerErrorException("Erro ao criar conta");
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
