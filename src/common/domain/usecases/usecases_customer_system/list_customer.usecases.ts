import { CustomerVersionService } from "@common/domain/service/service_customer_system/customer_version.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ListCustomerSystemUsecase {
  constructor(
    private readonly customerVersionService: CustomerVersionService
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
