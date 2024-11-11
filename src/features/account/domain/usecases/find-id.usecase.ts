import { Inject, Injectable } from "@nestjs/common";
import { AccountServiceMethods } from "../services/account.service";
import { AccountEntity } from "../entity/account.entity";

@Injectable()
export class FindAccountByIdUseCase {
  constructor(
    @Inject("AccountServiceMethods")
    private accountService: AccountServiceMethods
  ) {}

  async execute(id: number): Promise<AccountEntity | null> {
    if (!id || typeof id !== "number" || id <= 0) {
      throw new Error("ID não pode ser informado");
    }

    const account = await this.accountService.findById(id);
    return account;
  }
}
