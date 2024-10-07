import { CustomerVersion } from "../entity/customer_version.entity";
import { CustomerSystemVersionRepositoryTypes } from "../services/customer_system_version_types.repositories";

export class UpdateCustomerUseCase {
  constructor(private readonly service: CustomerSystemVersionRepositoryTypes) {}
  async execute(id: number, data: CustomerVersion): Promise<CustomerVersion> {
    const result = await this.service.update(id, data);
    return result;
  }
}
