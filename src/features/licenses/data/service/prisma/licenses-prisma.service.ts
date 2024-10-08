import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { TLicensesSchemaDto } from "features/licenses/domain/dto/licenses.dto";
import {
  LicenseEntity,
  type Settings,
} from "features/licenses/domain/entity/lincese.entity";
import { LicensesTypesService } from "features/licenses/domain/services/licenses-types.service";

@Injectable()
export class LicensesService implements LicensesTypesService {
  constructor(private readonly service: PrismaService) {}
  findBySystemIdAndContractIdAndVersionAndName(
    systemId: number,
    contractId: string,
    name: string
  ): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }
  findByName(name: string): Promise<LicenseEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findOne(id: number): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findUnique({
      where: { id },
    });
    return license ? this.toEntity(license) : null;
  }

  async findAll(): Promise<LicenseEntity[]> {
    const licenses = await this.service.licenses.findMany({
      orderBy: { id: "asc" },
    });

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

  async findById(id: number): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findUnique({
      where: { id },
    });
    return license ? this.toEntity(license) : null;
  }

  async create(createLicenseDto: TLicensesSchemaDto): Promise<LicenseEntity> {
    const res = await this.service.licenses.create({
      data: {
        contract_id: createLicenseDto.contract_id,
        system_id: createLicenseDto.system_id,
        settings: JSON.parse(JSON.stringify(createLicenseDto.settings)),
        monthly_fee: createLicenseDto.monthly_fee,
      },
    });
    return this.toEntity(res);
  }

  async update(
    id: number,
    updateLicenseDto: Partial<TLicensesSchemaDto>
  ): Promise<LicenseEntity> {
    try {
      const res = await this.service.licenses.update({
        where: { id },
        data: {
          contract_id: updateLicenseDto.contract_id,
          system_id: updateLicenseDto.system_id,
          settings: updateLicenseDto.settings
            ? JSON.parse(JSON.stringify(updateLicenseDto.settings))
            : undefined,
          monthly_fee: updateLicenseDto.monthly_fee,
        },
      });

      return this.toEntity(res);
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Erro ao atualizar a licença: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.service.licenses.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException("Licença não encontrada");
    }
  }

  // async findByName(name: string): Promise<LicenseEntity | null> {
  //   const license = await this.service.licenses.findFirst({
  //     where: { name },
  //   });
  //   return license ? this.toEntity(license) : null;
  // }

  async findByContractId(contractId: string): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findFirst({
      where: { contract_id: contractId },
    });
    return license ? this.toEntity(license) : null;
  }

  async findBySystemId(systemId: number): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findFirst({
      where: { system_id: systemId },
    });
    return license ? this.toEntity(license) : null;
  }

  async findBySystemIdAndContractId(
    systemId: number,
    contractId: string
  ): Promise<LicenseEntity | null> {
    const result = await this.service.licenses.findFirst({
      where: {
        system_id: systemId,
        contract_id: contractId,
      },
    });

    return result ? this.toEntity(result) : null;
  }

  async findBySystemIdAndVersion(
    systemId: number
  ): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findFirst({
      where: {
        system_id: systemId,
      },
    });
    return license ? this.toEntity(license) : null;
  }

  async findBySystemIdAndContractIdAndVersion(
    systemId: number,
    contractId: string
  ): Promise<LicenseEntity | null> {
    const license = await this.service.licenses.findFirst({
      where: {
        system_id: systemId,
        contract_id: contractId,
      },
    });
    return license ? this.toEntity(license) : null;
  }

  // async findBySystemIdAndContractIdAndVersionAndName(
  //   systemId: number,
  //   contractId: string,

  //   name: string
  // ): Promise<LicenseEntity | null> {
  //   const license = await this.service.licenses.findFirst({
  //     where: {
  //       system_id: systemId,
  //       contract_id: contractId,

  //       name,
  //     },
  //   });
  //   return license ? this.toEntity(license) : null;
  // }
}
