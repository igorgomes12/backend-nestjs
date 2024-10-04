import {
  BadRequestException,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { AccoutingServiceMethods } from "../services/accouting.service";
import { TAccountingSchema, AccountingSchema } from "../dto/accounting_zod";
import { AccountingFindAllEntity } from "../entity/accouting-findAll.entity";
import { formatCNPJ } from "@common/utils/regex/cpnj";

export class UpdateAccountingUseCase {
  private readonly logger = new Logger(UpdateAccountingUseCase.name);

  constructor(
    @Inject("AccoutingServiceMethods")
    private readonly service: AccoutingServiceMethods
  ) {}

  async execute(
    id: number,
    data: Partial<TAccountingSchema>
  ): Promise<AccountingFindAllEntity> {
    try {
      AccountingSchema.partial().parse(data);
    } catch (validationError) {
      this.logger.warn(
        `Validação falhou para os dados fornecidos: ${validationError}`
      );
      throw new BadRequestException("Dados de entrada inválidos");
    }

    const existingAccount = await this.service.findById(id);
    if (!existingAccount) {
      this.logger.warn(`Conta com ID ${id} não encontrada`);
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }

    const { name, cnpj, email } = data;

    if (name) {
      const existingNameAccount = await this.service.findByName(name);
      if (existingNameAccount && existingNameAccount.id !== id) {
        this.logger.warn(`Nome ${name} já existente`);
        throw new BadRequestException("Nome já existente");
      }
    }

    if (email) {
      const existingEmailAccount = await this.service.findByEmail(email);
      if (existingEmailAccount && existingEmailAccount.id !== id) {
        this.logger.warn(`E-mail ${email} já existente`);
        throw new BadRequestException("E-mail já existente");
      }
    }

    if (cnpj) {
      if (cnpj.length !== 14) {
        this.logger.warn(`CNPJ ${cnpj} inválido`);
        throw new BadRequestException(
          "CNPJ inválido. Deve conter 14 dígitos. Ex:000.000.000-00"
        );
      }
      const existingCNPJAccount = await this.service.findByCNPJ(cnpj);
      if (existingCNPJAccount && existingCNPJAccount.id !== id) {
        this.logger.warn(`CNPJ ${cnpj} já existente`);
        throw new BadRequestException("CNPJ já existente");
      }
    }

    const formattedCNPJ = cnpj ? formatCNPJ(cnpj) : existingAccount.cnpj;

    try {
      const updatedAccount = await this.service.update(id, {
        ...existingAccount,
        ...data,
        cnpj: formattedCNPJ,
      });
      this.logger.log(`Conta com ID ${id} atualizada com sucesso`);
      return updatedAccount;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar conta com ID ${id}: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );

      if (typeof error === "object" && error !== null && "code" in error) {
        const errorCode = (error as { code: string }).code;
        if (errorCode === "P2002") {
          throw new BadRequestException(
            `Já existe uma conta com o mesmo identificador único.`
          );
        }
      }

      throw new InternalServerErrorException(
        "Erro ao tentar atualizar a conta."
      );
    }
  }
}
