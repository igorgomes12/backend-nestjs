import { BadRequestException, Injectable } from "@nestjs/common";
import { TSchemaPayamentDtoForm } from "../dto/payment.dto";
import { PaymentEntity } from "../entity/payment.entity";
import { FormsPaymentService } from "../services/forms-payment.service";

@Injectable()
export class FindAllPaymentTypes {
  constructor(private readonly data: FormsPaymentService) {}

  async execute(params: TSchemaPayamentDtoForm): Promise<PaymentEntity[]> {
    try {
      const data = await this.data.findAll({
        id: params.id,
        name: params.name,
      });
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
