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

    if (!data.owner) {
      throw new BadRequestException(
        "É necessário fornecer pelo menos um proprietário."
      );
    }

    try {
      const client = {
        ...data,
        owner: {
          id: data.owner.id,
          createdAt: data.owner.createdAt,
          updatedAt: data.owner.updatedAt,
          deletedAt: data.owner.deletedAt,
          clientId: data.owner.clientId,
          cpf_cnpj: data.owner.cpf_cnpj,
          name: data.owner.name,
          birth_date: data.owner.birth_date,
        },
        accounting: {
          name: data.name_account,
          phone: data.contacts[0].contact,
          email: data.contacts[0].contact,
          crc: data.contacts[0].contact,
          cnpj: data.cpf_cnpj,
        },
        representative: {
          name: data.representativeName,
        },
      };
      return await this.service.create(client);
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
