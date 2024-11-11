import { Inject, Injectable } from "@nestjs/common";
import { AccountServiceMethods } from "../services/account.service";
import { TAccounts } from "../dto/account.dto";
import { AccountEntity } from "../entity/account.entity";

@Injectable()
export class FindAllAccountUseCase {
  constructor(
    @Inject("AccountServiceMethods")
    private accountService: AccountServiceMethods
  ) {}
  async execute(params: TAccounts): Promise<AccountEntity[]> {
    try {
      const result = await this.accountService.findAll(params);
      return result;
    } catch (error) {
      throw new Error("Falha ao buscar contas: " + error);
    }
  }
}
