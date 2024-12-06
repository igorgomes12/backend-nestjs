import { Inject, Injectable } from "@nestjs/common";
import { AgreementTypeService } from "../services/agreement-types.service";
import { AgreementEntity } from "../entity/agreement.entity";
@Injectable()
export class FindAllAgreementUseCase {
  constructor(
    @Inject("AgreementTypeService")
    private readonly agreementTypeService: AgreementTypeService
  ) {}

  async execute(): Promise<AgreementEntity[]> {
    const res = await this.agreementTypeService.findAll();
    if (res.length > 0) {
      return res;
    } else {
      throw new Error("Não foi possível encontrar os dados");
    }
  }
}
