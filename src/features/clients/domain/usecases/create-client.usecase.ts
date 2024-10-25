import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
} from "@nestjs/common";
import { ClientSchema, TClient } from "../dto/zod_client.schema";
import { ClientEntity } from "../entity/client.entity";
import { ClientEntityService } from "../services/clients.service";

@Injectable()
export class CreateClientUseCase {
  private readonly logger = new Logger(CreateClientUseCase.name);

  constructor(private readonly service: ClientEntityService) {}

  async execute(data: TClient): Promise<ClientEntity> {
    this.logger.debug("Modified data:", JSON.stringify(data, null, 2));

    const res = ClientSchema.safeParse(data);

    this.logger.debug("Validation result:", JSON.stringify(res, null, 2));

    if (!res.success) {
      this.logger.error("Validation failed:", res.error.format());
      throw new NotAcceptableException(res.error.format());
    }

    // Verificação de unicidade para CPF/CNPJ
    const existingClient = await this.service.findByCpfCnpj(data.cpf_cnpj);
    if (existingClient) {
      throw new BadRequestException("O CPF/CNPJ já está em uso.");
    }

    // Verificação de unicidade para nome corporativo
    const existingCorporateName = await this.service.findByCorporateName(
      data.corporate_name
    );
    if (existingCorporateName) {
      throw new BadRequestException("O nome corporativo já está em uso.");
    }

    // Verificação de campos obrigatórios
    if (!data.systemsId) {
      throw new BadRequestException("O campo 'systemsId' é obrigatório.");
    }

    if (!data.id_account) {
      throw new BadRequestException("O campo 'id_account' é obrigatório.");
    }

    if (!data.owner || data.owner.length === 0) {
      throw new BadRequestException(
        "É necessário fornecer pelo menos um proprietário."
      );
    }

    try {
      return await this.service.create(data);
    } catch (error) {
      this.logger.error("Erro ao criar cliente:", error);

      if (typeof error === "object" && error !== null && "code" in error) {
        const prismaError = error as {
          code: string;
          meta?: { field_name?: string };
        };
        if (prismaError.code === "P2003") {
          throw new BadRequestException(
            `Chave estrangeira inválida para o campo: ${prismaError.meta?.field_name}`
          );
        }
      }

      throw new BadRequestException("Erro ao criar cliente.");
    }
  }
}
