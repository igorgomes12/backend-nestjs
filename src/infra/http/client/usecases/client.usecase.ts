import { BadRequestException } from "@nestjs/common";
import type { ClientService } from "../client.service";
import type { ClientCreateService } from "../dto/interface.create.dto";
import type { TClient } from "../dto/schemas/zod_client.schema";

export class UseCaseClient {
  constructor(private client: ClientService) {}

  async execute(
    client: ClientCreateService.TInput
  ): Promise<ClientCreateService.TOutput> {
    const {
      data: { cpf_cnpj, corporate_name, contacts },
    } = client;
    const contactEmail = contacts.find((contact) => contact.type === "EMAIL");

    if (!cpf_cnpj || !corporate_name || !contactEmail) {
      throw new BadRequestException("Dados do cliente não enviados");
    }

    const existingClientByEmail = await this.client.findByEmail(
      contactEmail.contact
    );
    if (existingClientByEmail) {
      throw new BadRequestException("Cliente já cadastrado com este email");
    }

    const existingClientByCpfCnpj = await this.client.findByCpfCnpj(cpf_cnpj);
    if (existingClientByCpfCnpj) {
      throw new BadRequestException("Cliente já cadastrado com este CPF/CNPJ");
    }

    const createClient = await this.client.create(client.data);
    const formattedClient = this.formatClientDates(createClient);

    return {
      message: "Cliente criado com sucesso",
      client: formattedClient,
    };
  }

  private formatClientDates(client: any): TClient {
    return {
      ...client,
    };
  }
}
