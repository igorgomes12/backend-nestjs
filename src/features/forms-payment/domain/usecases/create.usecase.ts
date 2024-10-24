import { BadRequestException, Injectable } from "@nestjs/common";
import { TSchemaPayamentDtoForm, TSchemaPaymentDto } from "../dto/payment.dto";
import { PaymentEntity } from "../entity/payment.entity";
import { FormsPaymentService } from "../services/forms-payment.service";

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly data: FormsPaymentService) {}
  async execute(create: TSchemaPayamentDtoForm): Promise<PaymentEntity> {
    const { name } = TSchemaPaymentDto.parse(create);

    if (!name || name.length < 1) {
      throw new BadRequestException("Nome inválido");
    }
    const existingName = await this.data.findByName(name);
    if (existingName) {
      throw new BadRequestException("Nome já cadastrado");
    }
    return this.data.create({ name });
  }
}
