import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientEntityService } from "../services/clients.service";

@Injectable()
export class DeleteClientUsecase {
  constructor(private readonly service: ClientEntityService) {}

  async execute(id: number) {
    if (!id) {
      throw new BadRequestException("ID inválido fornecido.");
    }

    const client = await this.service.findById(id);

    if (!client) {
      throw new NotFoundException("Cliente não encontrado.");
    }

    await this.service.remove(id);
  }
}
