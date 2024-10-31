import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { ClientEntity } from "../entity/client.entity";
import { ClientEntityService } from "../services/clients.service";

@Injectable()
export class FindByIdClient {
  constructor(private readonly service: ClientEntityService) {}

  async execute(user_id: number): Promise<ClientEntity | null> {
    if (!user_id || typeof user_id !== "number" || user_id <= 0) {
      throw new NotAcceptableException("Invalid user ID provided.");
    }

    try {
      const client = await this.service.findById(user_id);
      if (!client) {
        throw new NotFoundException(`Client with ID ${user_id} not found.`);
      }
      return client;
    } catch (error) {
      console.error("Error finding client by ID:", error);
      throw error;
    }
  }
}
