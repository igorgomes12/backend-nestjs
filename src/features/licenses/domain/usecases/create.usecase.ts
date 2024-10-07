import {
  licensesSchemaDto,
  type TLicensesSchemaDto,
} from "../dto/licenses.dto";
import { LicenseEntity } from "../entity/lincese.entity";
import { LicensesTypesService } from "../services/licenses-types.service";

export class CreateLicenseUsecase {
  constructor(private readonly service: LicensesTypesService) {}

  async execute(createLinceseDto: TLicensesSchemaDto): Promise<LicenseEntity> {
    const res = licensesSchemaDto.safeParse(createLinceseDto);

    if (!res.success) {
      throw new Error(res.error.message);
    }

    try {
      return await this.service.create(createLinceseDto);
    } catch (error) {
      throw error;
    }
  }
}
