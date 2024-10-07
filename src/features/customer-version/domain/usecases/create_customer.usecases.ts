import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  TCustomerVersionDto,
  customerVersionSchemaDto,
} from "features/customer-version/domain/dto/zod_customer.dto";
import { CustomerSystemVersionRepositoryTypes } from "../services/customer_system_version_types.repositories";
import { CustomerVersion } from "../entity/customer_version.entity";

@Injectable()
export class CreateCustomerSystemUsecase {
  constructor(
    private readonly customerVersionService: CustomerSystemVersionRepositoryTypes
  ) {}

  async execute(data: TCustomerVersionDto) {
    const { system_id, version, customer_id, assigned_date } =
      customerVersionSchemaDto.parse(data);

    if (!system_id || system_id === 0) {
      throw new NotFoundException(
        "Não foi possível associar um sistema ao cliente."
      );
    }

    if (!customer_id || customer_id === 0) {
      throw new NotFoundException(
        "Não foi possível associar um cliente ao sistema."
      );
    }

    if (!version) {
      throw new NotFoundException(
        "Não foi possível associar uma versão ao sistema."
      );
    }

    if (!assigned_date) {
      throw new NotFoundException(
        "Não foi possível associar uma data de atribuição ao sistema."
      );
    }

    const existingVersion =
      await this.customerVersionService.findBySystemIdAndVersion(
        system_id,
        version
      );
    if (existingVersion) {
      throw new ConflictException(
        "Versão do sistema já cadastrada para este sistema."
      );
    }

    try {
      const newCustomerVersion = new CustomerVersion({
        system_id,
        version,
        customer_id,
        assigned_date,
      });

      const result =
        await this.customerVersionService.create(newCustomerVersion);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new NotFoundException("Erro ao tentar criar sistema");
    }
  }
}
