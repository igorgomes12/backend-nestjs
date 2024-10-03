import type { CustomerVersion } from "@common/domain/entities/entities_customer_system/customer_version.entity";

export interface ICustomerSystemVersionRepositoryTypes {
  findAll(): Promise<CustomerVersion[]>;
  findOne(id: number): Promise<CustomerVersion | null>;
  findByVersion(version: string): Promise<CustomerVersion | null>;
  findBySystemIdAndVersion(
    system_id: number,
    version: string
  ): Promise<CustomerVersion | null>;
  create(data: CustomerVersion): Promise<CustomerVersion>;
  update(id: number, data: CustomerVersion): Promise<CustomerVersion>;
  remove(id: number): Promise<{ message: string }>;
}
