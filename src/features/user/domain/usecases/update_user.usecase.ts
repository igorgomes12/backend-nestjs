import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateserEntity } from "../entity/update.entity";
import { UserService } from "../services/user.service";

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly service: UserService) {}

  async execute(
    userId: number,
    updateData: Partial<UpdateserEntity>
  ): Promise<UpdateserEntity> {
    if (!userId) {
      throw new BadRequestException("ID é necessário");
    }

    const ID = Number(userId);
    if (isNaN(ID)) {
      throw new BadRequestException("ID inválido");
    }

    const existingUser = await this.service.findById(ID);
    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const updatedUser = {
      ...existingUser,
      ...updateData,
    };

    return await this.service.update(ID, updatedUser);
  }
}
