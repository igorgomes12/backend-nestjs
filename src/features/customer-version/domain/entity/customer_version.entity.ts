import {
  customerVersionSchemaDto,
  type TCustomerVersionDto,
} from "features/customer-version/domain/dto/zod_customer.dto";

export interface TInput {
  id?: number;
  customer_id: number;
  system_id: number;
  version: string;
  assigned_date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type TOutput = {
  id: number;
  customer_id: number;
  system_id: number;
  version: string;
  assigned_date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export class CustomerVersion {
  id: number;
  customer_id: number;
  system_id: number;
  version: string;
  assigned_date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data: TCustomerVersionDto) {
    const validatedData = customerVersionSchemaDto.parse({
      ...data,
      id: CustomerVersion.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    this.id = validatedData.id;
    this.customer_id = validatedData.customer_id;
    this.system_id = validatedData.system_id;
    this.version = validatedData.version;
    this.assigned_date = validatedData.assigned_date;
    this.createdAt = validatedData.createdAt;
    this.updatedAt = validatedData.updatedAt;
    this.deletedAt = validatedData.deletedAt;
  }

  private static generateId(): number {
    if (!this.currentId) {
      this.currentId = 1;
    } else {
      this.currentId += 1;
    }
    return this.currentId;
  }

  toOutput(): TOutput {
    return {
      id: this.id,
      customer_id: this.customer_id,
      system_id: this.system_id,
      version: this.version,
      assigned_date: this.assigned_date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static currentId: number;
}
