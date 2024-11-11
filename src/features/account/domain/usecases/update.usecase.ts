import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { TAccounts } from "../dto/account.dto";
import type { AccountEntity } from "../entity/account.entity";
import type { AccountServiceMethods } from "../services/account.service";

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject("AccountServiceMethods")
    private accountService: AccountServiceMethods
  ) {}
  async execute(id: number, params: TAccounts): Promise<AccountEntity> {
    const { value, bank, description, observation, status } = params;
    if (!id) {
      throw new BadRequestException("ID não pode ser informado");
    }

    const existingAccount = await this.accountService.findById(id);
    if (!existingAccount) {
      throw new Error("Conta não encontrada");
    }

    const updatedAccount = {
      ...existingAccount,
      value,
      bank,
      description,
      observation,
      status,
    };

    return this.accountService.update(id, updatedAccount);
  }
}
