import { User } from "@prisma/client";
import { UserEntity } from "../entity/user.entity";
import { NotAcceptableException } from "@nestjs/common";

export class UserMapper {
  static toEntity(model: User): UserEntity {
    try {
      return new UserEntity(
        model.name,
        model.email,
        model.profileId,
        model.status || "active",
        model.id
      );
    } catch {
      throw new NotAcceptableException(`Erro ao converter para Entidade`);
    }
  }
}
