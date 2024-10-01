import { NotFoundException } from "@nestjs/common";
import { CustomerSystemVersionRepositories } from "../repositories/customer_system_version.repositories";

export class DeleteCustomerUsecase {
  constructor(
    private readonly customerRepository: CustomerSystemVersionRepositories
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
