import { TSchemaPayamentDtoForm } from "../dto/payment.dto";
import { PaymentEntity } from "../entity/payment.entity";

export abstract class FormsPaymentService {
  abstract findAll(params: TSchemaPayamentDtoForm): Promise<PaymentEntity[]>;
  abstract findById(id: number): Promise<PaymentEntity | null>;
  abstract create(user: TSchemaPayamentDtoForm): Promise<PaymentEntity>;
  abstract update(
    id: number,
    user: Partial<PaymentEntity>
  ): Promise<PaymentEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findByName(name: string): Promise<PaymentEntity | null>;
}
