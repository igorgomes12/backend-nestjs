import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { TLicensesSchemaDto } from "features/licenses/domain/dto/licenses.dto";
import { LicenseEntity } from "features/licenses/domain/entity/lincese.entity";
import { LicensesTypesService } from "features/licenses/domain/services/licenses-types.service";

@Injectable()
export class LincesesService implements LicensesTypesService {
  constructor(private readonly service: PrismaService) {}
  findOne(id: number): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<LicenseEntity[]> {
    const licenses = await this.service.licenses.findMany();
    return licenses.map((license) => this.toEntity(license));
  }

  private toEntity(license: any): LicenseEntity {
    return {
      id: license.id,
      contract_id: license.contract_id,
      system_id: license.system_id,
      settings: license.settings,
      deleted_at: license.deleted_at,
      monthly_fee: license.monthly_fee,
    };
  }
  findById(id: number): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  async create(createLinceseDto: TLicensesSchemaDto): Promise<LicenseEntity> {
    const res = await this.service.licenses.create({
      data: {
        contract_id: createLinceseDto.contract_id,
        system_id: createLinceseDto.system_id,
        settings: JSON.parse(JSON.stringify(createLinceseDto.settings)),
        monthly_fee: createLinceseDto.monthly_fee,
      },
    });
    return this.toEntity(res);
  }
  async update(
    id: number,
    updateLicenseDto: Partial<LicenseEntity>
  ): Promise<LicenseEntity> {
    const res = this.service.licenses.update({
      where: {
        id,
      },
      data: {
        contract_id: updateLicenseDto.contract_id,
        system_id: updateLicenseDto.system_id,
        settings: JSON.parse(JSON.stringify(updateLicenseDto.settings)),
        monthly_fee: updateLicenseDto.monthly_fee,
      },
    });

    return this.toEntity(res);
  }
  async remove(id: number): Promise<void> {
    const res = await this.service.licenses.delete({
      where: {
        id,
      },
    });
    if (!res) {
      throw new Error("Licença não encontrada");
    }
    return;
  }
  findByName(name: string): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findByContractId(contractId: string): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findBySystemId(systemId: string): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findBySystemIdAndContractId(
    systemId: string,
    contractId: string
  ): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findBySystemIdAndVersion(
    systemId: string,
    version: string
  ): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findBySystemIdAndContractIdAndVersion(
    systemId: string,
    contractId: string,
    version: string
  ): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findBySystemIdAndContractIdAndVersionAndName(
    systemId: string,
    contractId: string,
    version: string,
    name: string
  ): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
}
