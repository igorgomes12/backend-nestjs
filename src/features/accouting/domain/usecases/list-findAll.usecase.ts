import type { TAccountingSchema } from "../dto/accounting_zod";
import type { AccountingFindAllEntity } from "../entity/accouting-findAll.entity";
import type { AccoutingServiceMethods } from "../services/accouting.service";

export class ListFindAllUseCase {
  constructor(private readonly service: AccoutingServiceMethods) {}
  async execute(data: TAccountingSchema): Promise<AccountingFindAllEntity[]> {
    const result = await this.service.findAll({
      name: data.name,
      cnpj: data.cnpj,
      contact: data.contact,
      crc: data.crc,
      email: data.email,
      phone: data.phone,
    });

    return result;
  }
}
