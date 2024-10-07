import { CustomerVersion } from "features/customer-version/domain/entity/customer_version.entity";

export abstract class CustomerSystemVersionRepositoryTypes {
  abstract findAll(): Promise<CustomerVersion[]>;
  abstract findOne(id: number): Promise<CustomerVersion | null>;
  abstract findByVersion(version: string): Promise<CustomerVersion | null>;
  abstract findBySystemIdAndVersion(
    system_id: number,
    version: string
  ): Promise<CustomerVersion | null>;
  abstract create(data: CustomerVersion): Promise<CustomerVersion>;
  abstract update(id: number, data: CustomerVersion): Promise<CustomerVersion>;
  abstract remove(id: number): Promise<{ message: string }>;
}
