import { TAccountingSchema } from "../dto/accounting_zod";
import { AccountingFindAllEntity } from "../entity/accouting-findAll.entity";

export abstract class AccoutingServiceMethods {
  abstract findAll(
    params: TAccountingSchema
  ): Promise<AccountingFindAllEntity[]>;
  abstract findById(user_id: number): Promise<AccountingFindAllEntity | null>;
  abstract findByEmail(email: string): Promise<AccountingFindAllEntity | null>;
  abstract create(user: TAccountingSchema): Promise<AccountingFindAllEntity>;
  abstract findByCNPJ(cnpj: string): Promise<AccountingFindAllEntity | null>;

  abstract update(
    user_id: number,
    user: Partial<AccountingFindAllEntity>
  ): Promise<AccountingFindAllEntity>;
  abstract delete(user_id: number): Promise<void>;
  abstract findByName(name: string): Promise<AccountingFindAllEntity | null>;
}
