import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientEntityService } from "../services/clients.service";
import { ClientEntity } from "../entity/client.entity";

@Injectable()
export class UpdateClientUsecase {
  constructor(private readonly service: ClientEntityService) {}

  async execute(id: number, updateClientData: Partial<ClientEntity>) {
    if (!id) {
      throw new BadRequestException("ID é necessário");
    }

    const existingUser = await this.service.findById(id);
    if (!existingUser) {
      throw new NotFoundException("cliente não encontrado");
    }

    const updateData = {
      ...existingUser,
      ...updateClientData,
      createdAt:
        updateClientData.createdAt instanceof Date
          ? updateClientData.createdAt.toISOString()
          : updateClientData.createdAt,
      updatedAt:
        updateClientData.updatedAt instanceof Date
          ? updateClientData.updatedAt.toISOString()
          : updateClientData.updatedAt,
      deletedAt:
        updateClientData.deletedAt instanceof Date
          ? updateClientData.deletedAt.toISOString()
          : updateClientData.deletedAt,
    };

    return await this.service.update(id, updateData);
  }
}
