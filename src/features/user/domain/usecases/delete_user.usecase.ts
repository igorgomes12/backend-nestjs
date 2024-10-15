import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "../services/user.service";

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly service: UserService) {}

  async execute(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException("ID é necessário");
    }

    const ID = Number(id);
    if (isNaN(ID)) {
      throw new BadRequestException("ID inválido");
    }

    const user = await this.service.findById(ID);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.service.delete(ID);
  }
}
