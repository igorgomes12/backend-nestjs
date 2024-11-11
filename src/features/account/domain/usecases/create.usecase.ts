import { Inject, Injectable } from "@nestjs/common";
import type { TAccounts } from "../dto/account.dto";
import type { AccountEntity } from "../entity/account.entity";
import type { AccountServiceMethods } from "../services/account.service";

@Injectable()
export class CreateAccountUsecase {
  constructor(
    @Inject("AccountServiceMethods")
    private accountService: AccountServiceMethods
  ) {}

  async execute(params: TAccounts): Promise<AccountEntity> {
    const { value, bank, description, observation, status } = params;
    if (!value || !bank || !description) {
      throw new Error("Insira valores válidos");
    }
    const existingAccount = await this.accountService.findByName(description);
    if (existingAccount) {
      throw new Error("Ja existe uma conta com esse nome");
    }

    try {
      const result = await this.accountService.create({
        value,
        bank,
        description,
        observation,
        status,
      });
      return result;
    } catch (error) {
      throw new Error("Falha ao criar conta: " + error);
    }
  }
}
