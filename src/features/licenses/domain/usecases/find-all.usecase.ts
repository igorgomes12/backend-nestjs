import { Injectable } from "@nestjs/common";
import { LicenseEntity } from "../entity/lincese.entity";
import { LicensesTypesService } from "../services/licenses-types.service";

@Injectable()
export class FindAllLicensesUseCase {
  constructor(private readonly service: LicensesTypesService) {}

  async execute(): Promise<LicenseEntity[]> {
    try {
      return await this.service.findAll();
    } catch (error) {
      throw new Error("Failed to fetch licenses");
    }
  }
}
