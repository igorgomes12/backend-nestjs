import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { LicensesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { LicensesTypesService } from "../services/licenses-types.service";

@Injectable()
export class DeleteLicenseUsecase {
  constructor(
    @Inject(LicensesService)
    private readonly licensesService: LicensesTypesService
  ) {}
  async execute(id: number) {
    const res = await this.licensesService.findById(id);
    if (!res) {
      throw new NotFoundException("LicUsageId não encontrada");
    }
    try {
      await this.licensesService.remove(id);
      return { message: "Licença deletada com sucesso" };
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);

      throw new NotFoundException("Ocorreu um erro ao deletar a licença");
    }
  }
}
