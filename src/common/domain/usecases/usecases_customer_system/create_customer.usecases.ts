import {
  NotFoundException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import {
  customerVersionSchemaDto,
  type TCustomerVersionDto,
} from "../../../../infra/http/customer_version/dto/zod_customer.dto";
import { CustomerVersionService } from "../../service/service_customer_system/customer_version.service";

@Injectable()
export class CreateCustomerSystemUsecase {
  constructor(
    private readonly customerVersionService: CustomerVersionService
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

    // Verificar se a versão já está cadastrada para o system_id
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
      const result = await this.customerVersionService.create({
        system_id,
        version,
        customer_id,
        assigned_date,
      });
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new NotFoundException("Erro ao tentar criar sistema");
    }
  }
}
