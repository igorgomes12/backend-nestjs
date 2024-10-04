import { Injectable } from "@nestjs/common";
import { ClientEntityService } from "../services/clients.service";

@Injectable()
export class FindAllClientUseCase {
  constructor(private readonly service: ClientEntityService) {}
  async execute() {
    try {
      const clients = await this.service.findAll();
      return clients;
    } catch (error) {
      throw new Error(error instanceof Error && error.message);
    }
  }
}
