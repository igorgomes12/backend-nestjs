import { Inject, Injectable } from "@nestjs/common";
import type { AccountServiceMethods } from "../services/account.service";

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject("AccountServiceMethods")
    private accountService: AccountServiceMethods
  ) {}

  async execute(id: number): Promise<void> {
    const existingId = await this.accountService.findById(id);
    if (!existingId) {
      throw new Error("id não encontrado");
    }

    return this.accountService.remove(id);
  }
}
