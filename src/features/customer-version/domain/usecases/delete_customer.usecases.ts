import { NotFoundException } from "@nestjs/common";
import type { CustomerSystemVersionRepositoryTypes } from "../services/customer_system_version_types.repositories";

export class DeleteCustomerUsecase {
  constructor(
    private readonly customerRepository: CustomerSystemVersionRepositoryTypes
  ) {}
  async execute(id: number) {
    if (!id) {
      throw new NotFoundException("ID não fornecido.");
    }
    const customerDelete = await this.customerRepository.findOne(id);
    if (!customerDelete) {
      throw new NotFoundException("CustomerVersion não encontrado.");
    }
    await this.customerRepository.remove(id);
    return { message: "CustomerVersion excluído com sucesso." };
  }
}
