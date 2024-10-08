import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { LicensesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { licensesSchemaDto, TLicensesSchemaDto } from "../dto/licenses.dto";
import { LicenseEntity } from "../entity/lincese.entity";
import { LicensesTypesService } from "../services/licenses-types.service";

@Injectable()
export class CreateLicenseUsecase {
  constructor(
    @Inject(LicensesService)
    private readonly licensesService: LicensesTypesService
  ) {}

  async execute(createLicenseDto: TLicensesSchemaDto): Promise<LicenseEntity> {
    const res = licensesSchemaDto.safeParse(createLicenseDto);
    if (!res.success) {
      throw new BadRequestException(`Validation Error: ${res.error.message}`);
    }

    try {
      const { contract_id, system_id } = createLicenseDto;

      const existingLicense =
        await this.licensesService.findBySystemIdAndContractId(
          system_id,
          contract_id
        );
      if (existingLicense) {
        throw new BadRequestException(
          "A license with the given system and contract ID already exists."
        );
      }

      return await this.licensesService.create(createLicenseDto);
    } catch (error) {
      console.error("Error creating license:", error);
      throw new InternalServerErrorException(
        "Internal server error while creating the license."
      );
    }
  }
}
