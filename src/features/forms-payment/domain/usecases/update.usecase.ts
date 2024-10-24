import { BadRequestException, Injectable } from "@nestjs/common";
import { PaymentEntity } from "../entity/payment.entity";
import { FormsPaymentService } from "../services/forms-payment.service";

@Injectable()
export class UpdatePaymentUsecase {
  constructor(private readonly data: FormsPaymentService) {}

  async execute(
    id: number,
    payment: Partial<PaymentEntity>
  ): Promise<PaymentEntity> {
    const { name } = payment;
    if (name !== undefined && (name === null || name.length < 1)) {
      throw new BadRequestException("Nome inválido");
    }
    const paymentexist = await this.data.findById(id);
    if (!paymentexist) {
      throw new BadRequestException("Forma de pagamento não encontrado");
    }
    return await this.data.update(id, payment);
  }
}
