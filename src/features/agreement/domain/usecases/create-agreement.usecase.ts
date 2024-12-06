import { Inject, Injectable } from "@nestjs/common";
import type { AgreementTypeService } from "../services/agreement-types.service";
import type { AgreementDTO } from "../dto/agreement.dto";
import type { AgreementEntity } from "../entity/agreement.entity";

@Injectable()
export class CreateAgreementUseCase {
  constructor(
    @Inject("AgreementTypeService")
    private readonly agreementTypeService: AgreementTypeService
  ) {}

  async execute(user: AgreementDTO): Promise<AgreementEntity> {
    try {
      const agreementCreate = await this.agreementTypeService.create({
        timestamp: user.timestamp,
        representativeId: user.representativeId,
        description: user.description,
        value: user.value,
        clientId: user.clientId,
        paymment: user.paymment,
        paymentId: user.paymentId,
        observation: user.observation,
        situation: user.situation,
        situatonpayment: user.situatonpayment,
      });
      return agreementCreate;
    } catch (error) {
      throw new Error("Erro ao criar agreement: " + error);
    }
  }
}
