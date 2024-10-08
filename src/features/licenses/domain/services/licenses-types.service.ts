import { TLicensesSchemaDto } from "../dto/licenses.dto";
import { LicenseEntity } from "../entity/lincese.entity";

export abstract class LicensesTypesService {
  abstract findAll(): Promise<LicenseEntity[]>;

  abstract findById(id: number): Promise<LicenseEntity | null>;

  abstract findOne(id: number): Promise<LicenseEntity | null>;

  abstract create(createLinceseDto: TLicensesSchemaDto): Promise<LicenseEntity>;

  abstract update(
    id: number,
    updateLicenseDto: Partial<TLicensesSchemaDto>
  ): Promise<LicenseEntity>;

  abstract remove(id: number): Promise<void>;

  abstract findByContractId(contractId: string): Promise<LicenseEntity | null>;

  abstract findBySystemId(systemId: number): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndContractId(systemId: number, contractId: string);

  abstract findBySystemIdAndVersion(
    systemId: number
  ): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndContractIdAndVersion(
    systemId: number,
    contractId: string
  ): Promise<LicenseEntity | null>;
}
