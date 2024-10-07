import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomerSystemVersionRepositoryTypes } from "../services/customer_system_version_types.repositories";

@Injectable()
export class ListCustomerSystemUsecase {
  constructor(
    private readonly customerVersionService: CustomerSystemVersionRepositoryTypes
  ) {}

  async execute() {
    try {
      const systems = await this.customerVersionService.findAll();
      if (systems.length === 0) {
        throw new NotFoundException("Nenhum item encontrado!");
      }
      return systems;
    } catch (error) {
      throw new NotFoundException("Não possui items na lista");
    }
  }
}
