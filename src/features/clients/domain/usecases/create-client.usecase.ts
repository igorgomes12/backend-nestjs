import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ClientEntityService } from "../services/clients.service";
import { ClientSchema, TClient } from "../dto/zod_client.schema";
import { ClientEntity } from "../entity/client.entity";

@Injectable()
export class CreateClientUseCase {
  private readonly logger = new Logger(CreateClientUseCase.name);

  constructor(private readonly service: ClientEntityService) {}

  async execute(data: TClient): Promise<ClientEntity> {
    this.logger.debug("Modified data:", JSON.stringify(data, null, 2));

    const res = ClientSchema.safeParse(data);

    this.logger.debug("Validation result:", JSON.stringify(res, null, 2));

    if (!res.success) {
      this.logger.error("Validation failed:", res.error.message);
      throw new BadRequestException(res.error.message);
    }

    try {
      return await this.service.create(data);
    } catch (error) {
      this.logger.error("Erro ao criar cliente:", error);
      if (error === "P2003") {
        throw new BadRequestException("Chave estrangeira inválida.");
      }
      throw new BadRequestException("Erro ao criar cliente.");
    }
  }
}
