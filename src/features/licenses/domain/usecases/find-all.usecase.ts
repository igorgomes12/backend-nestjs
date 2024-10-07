import type { LicenseEntity } from "../entity/lincese.entity";
import { LicensesTypesService } from "../services/licenses-types.service";

export class FindAllLicensesUseCase {
  constructor(private readonly service: LicensesTypesService) {}
  async execute(): Promise<LicenseEntity[]> {
    return await this.service.findAll();
  }
}
