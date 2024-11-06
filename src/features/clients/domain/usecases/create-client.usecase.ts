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
    this.logger.debug("Received data:", JSON.stringify(data, null, 2));

    const validation = ClientSchema.safeParse(data);
    this.logger.debug(
      "Validation result:",
      JSON.stringify(validation, null, 2)
    );

    if (!validation.success) {
      this.logger.error("Validation failed:", validation.error.format());
      throw new NotAcceptableException(validation.error.format());
    }

    await this.checkExistingClient(data);

    if (!data.owner) {
      throw new BadRequestException(
        "É necessário fornecer pelo menos um proprietário."
      );
    }

    try {
      return await this.service.create(validation.data);
    } catch (error) {
      this.handleCreationError(error);
    }
  }

  private async checkExistingClient(data: TClient) {
    const existingClient = await this.service.findByCpfCnpj(data.cpf_cnpj);
    if (existingClient) {
      throw new BadRequestException("O CPF/CNPJ já está em uso.");
    }

    const existingCorporateName = await this.service.findByCorporateName(
      data.corporate_name
    );
    if (existingCorporateName) {
      throw new BadRequestException("O nome corporativo já está em uso.");
    }
  }

  private handleCreationError(error: any) {
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
