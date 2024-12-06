import { Inject, Injectable } from "@nestjs/common";
import type { AgreementTypeService } from "../services/agreement-types.service";

@Injectable()
export class DeleteAgreementUsecase {
  constructor(
    @Inject("AgreementTypeService")
    private readonly agreementTypeService: AgreementTypeService
  ) {}
  async execute(id: number) {
    if (!id) {
      throw new Error("ID não fornecido.");
    }
    const agreementDelete = await this.agreementTypeService.findById(id);
    if (!agreementDelete) {
      throw new Error("Agreement não encontrado.");
    }
    await this.agreementTypeService.delete(id);
    return { message: "Agreement excluído com sucesso." };
  }
}
