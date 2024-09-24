import {
  Client,
  type TClientProps,
} from "@infra/http/client/entities/client.entity";
import type { ClientGateway } from "@infra/http/client/gateway/client.gateway";
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

function mapToClientCreateInput(
  clientProps: TClientProps
): Prisma.ClientCreateInput {
  return {
    identifier: clientProps.identifier,
    createdAt: clientProps.createdAt,
    updatedAt: clientProps.updatedAt,
    deletedAt: clientProps.deletedAt,
    corporate_name: clientProps.corporate_name,
    fantasy_name: clientProps.fantasy_name,
    contacts: {
      create: clientProps.contacts.map((contact) => ({
        description: contact.description,
        contact: contact.contact,
        type: contact.type,
        main_account: contact.main_account,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        deletedAt: contact.deletedAt,
      })),
    },
    cpf_cnpj: clientProps.cpf_cnpj,
    state_registration: clientProps.state_registration,
    municipal_registration: clientProps.municipal_registration,
    rural_registration: clientProps.rural_registration,
    address: {
      create: clientProps.address.map((address) => ({
        street: address.street,
        number: address.number,
        complement: address.complement,
        postal_code: address.postal_code,
        neighborhood: address.neighborhood,
        municipality_id: address.municipality_id,
        municipality_name: address.municipality_name,
        state_id: address.state_id,
        state: address.state,
        country_id: address.country_id,
        region_id: address.region_id,
        description: address.description,
        main: address.main,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
        deletedAt: address.deletedAt,
      })),
    },
    accounting: {
      create: clientProps.accounting.map((accounting) => ({
        observation: accounting.observation,
        establishment_type_id: accounting.establishment_type_id,
        taxation_type_id: accounting.taxation_type_id,
        status: accounting.status,
        company_id: accounting.company_id,
        representative_id: accounting.representative_id,
        owner_id: accounting.owner_id,
        createdAt: accounting.createdAt,
        updatedAt: accounting.updatedAt,
        deletedAt: accounting.deletedAt,
      })),
    },
    owner: {
      create: clientProps.owner.map((owner) => ({
        name: owner.name,
        cpf_cnpj: owner.cpf_cnpj,
        birth_date: owner.birth_date,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt,
        deletedAt: owner.deletedAt,
      })),
    },
  };
}

export class ClientRepository implements ClientGateway {
  constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ClientRepository(prismaClient);
  }

  public async list(): Promise<Client[]> {
    const clientsData = await this.prismaClient.client.findMany();
    return clientsData.map((data) => Client.fromJSON(JSON.stringify(data)));
  }

  public async save(client: Client): Promise<void> {
    const data = mapToClientCreateInput(client.toJSON());
    await this.prismaClient.client.create({
      data,
    });
  }

  public async update(client: Client): Promise<void> {
    const data = mapToClientCreateInput(client.toJSON());
    await this.prismaClient.client.update({
      where: { id: Number(client.id) },
      data,
    });
  }

  public async delete(clientId: string): Promise<void> {
    await this.prismaClient.client.delete({
      where: { id: parseInt(clientId, 10) },
    });
  }
}
