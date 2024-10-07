import { TLicensesSchemaDto } from "../dto/licenses.dto";
import { LicenseEntity } from "../entity/lincese.entity";

export abstract class LicensesTypesService {
  abstract findAll(): Promise<LicenseEntity[]>;

  abstract findById(id: number): Promise<LicenseEntity | null>;

  abstract findOne(id: number): Promise<LicenseEntity | null>;

  abstract create(createLinceseDto: TLicensesSchemaDto): Promise<LicenseEntity>;

  abstract update(
    id: number,
    updateLicenseDto: Partial<LicenseEntity>
  ): Promise<LicenseEntity>;

  abstract remove(id: number): Promise<void>;

  abstract findByName(name: string): Promise<LicenseEntity | null>;

  abstract findByContractId(contractId: string): Promise<LicenseEntity | null>;

  abstract findBySystemId(systemId: string): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndContractId(
    systemId: string,
    contractId: string
  ): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndVersion(
    systemId: string,
    version: string
  ): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndContractIdAndVersion(
    systemId: string,
    contractId: string,
    version: string
  ): Promise<LicenseEntity | null>;

  abstract findBySystemIdAndContractIdAndVersionAndName(
    systemId: string,
    contractId: string,
    version: string,
    name: string
  ): Promise<LicenseEntity | null>;
}
