import type { TAccounts } from "../dto/account.dto";
import type { AccountEntity } from "../entity/account.entity";

export abstract class AccountServiceMethods {
  abstract findAll(params: TAccounts): Promise<AccountEntity[]>;
  abstract update(id: number, params: TAccounts): Promise<AccountEntity>;
  abstract remove(id: number): Promise<void>;
  abstract create(params: TAccounts): Promise<AccountEntity>;
  abstract findByName(name: string): Promise<AccountEntity | null>;
  abstract findById(id: number): Promise<AccountEntity | null>;
}
