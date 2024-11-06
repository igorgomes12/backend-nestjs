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

    if (!data.owners) {
      throw new BadRequestException(
        "É necessário fornecer pelo menos um proprietário."
      );
    }

    const client = this.constructClientEntity(data);

    try {
      return await this.service.create(client);
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

  private parseDate(date: Date | string | undefined): Date | undefined {
    return typeof date === "string" ? new Date(date) : date;
  }

  private ensureDate(value: Date | string | undefined): Date | undefined {
    if (!value) return undefined;
    return value instanceof Date ? value : new Date(value);
  }

  private constructClientEntity(data: TClient): ClientEntity {
    return new ClientEntity({
      ...data,
      createdAt: this.ensureDate(data.createdAt),
      updatedAt: this.ensureDate(data.updatedAt),
      deletedAt: this.ensureDate(data.deletedAt),
      owners: {
        ...data.owners,
        createdAt: this.ensureDate(data.owners?.createdAt),
        updatedAt: this.ensureDate(data.owners?.updatedAt),
        deletedAt: this.ensureDate(data.owners?.deletedAt),
      },
      contacts: data.contacts.map((contact) => ({
        ...contact,
        createdAt: this.ensureDate(contact.createdAt),
        updatedAt: this.ensureDate(contact.updatedAt),
        deletedAt: this.ensureDate(contact.deletedAt),
      })),
      addresses: data.addresses.map((addr) => ({
        ...addr,
        createdAt: this.ensureDate(addr.createdAt),
        updatedAt: this.ensureDate(addr.updatedAt),
        deletedAt: this.ensureDate(addr.deletedAt),
      })),
      idAccount: data.id_account || 0,
      establishmentTypeId: data.establishment_typeId || 0,
    });
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
