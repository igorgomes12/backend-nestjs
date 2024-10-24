import { Injectable } from "@nestjs/common";
import { FormsPaymentService } from "../services/forms-payment.service";

@Injectable()
export class DeletePaymentUseCase {
  constructor(private readonly data: FormsPaymentService) {}

  async execute(id: number): Promise<void> {
    const existingId = await this.data.findById(id);
    if (!existingId) {
      throw new Error("id não encontrado");
    }

    await this.data.delete(id);
  }
}
