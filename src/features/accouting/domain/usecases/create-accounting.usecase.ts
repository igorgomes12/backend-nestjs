import {
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { AccoutingServiceMethods } from "../services/accouting.service";
import { TAccountingSchema } from "../dto/accounting_zod";
import { formatCNPJ } from "@common/utils/regex/cpnj";

export class CreateAccountingUseCase {
  constructor(
    @Inject("AccoutingServiceMethods")
    private readonly service: AccoutingServiceMethods
  ) {}

  async execute(data: TAccountingSchema) {
    const { email, name, cnpj, contact, crc, phone } = data;

    // Verifica se o nome já existe
    const existingNameAccount = await this.service.findByName(name);
    if (existingNameAccount) {
      throw new BadRequestException("Nome já existente");
    }

    const existingEmailAccount = await this.service.findByEmail(email);
    if (existingEmailAccount) {
      throw new BadRequestException("E-mail já existente");
    }

    if (cnpj.length !== 14) {
      throw new BadRequestException(
        "CNPJ inválido. Deve conter 14 dígitos. Ex:000.000.000-00"
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
