import { NotAcceptableException } from "@nestjs/common";
import type { Account } from "@prisma/client";
import { AccountEntity } from "features/account/domain/entity/account.entity";

export class AccountMapper {
  static toEntity(model: Account): AccountEntity {
    try {
      return new AccountEntity({
        id: model.id,
        value: model.value,
        description: model.description,
        observation: model.observation,
        status: model.status,
        bank: model.bank,
      });
    } catch {
      throw new NotAcceptableException(`Erro ao converter para Entidade`);
    }
  }
}
