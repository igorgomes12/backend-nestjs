import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TClient } from "features/clients/domain/dto/zod_client.schema";
import { ClientEntity } from "features/clients/domain/entity/client.entity";
import { ClientEntityService } from "features/clients/domain/services/clients.service";

export class ClientsPrismaService implements ClientEntityService {
  constructor(private readonly prisma: PrismaService) {}
  async findByCorporateName(corporate_name: string) {
    const res = await this.prisma.client.findFirst({
      where: { corporate_name },
    });
    return res;
  }
  async findAll(): Promise<ClientEntity[]> {
    const clients = await this.prisma.client.findMany({
      include: {
        contacts: true,
        address: true,
        owner: true,
        representative: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return clients.map((client) => {
      return new ClientEntity({
        id: client.id,
        corporate_name: client.corporate_name,
        fantasy_name: client.fantasy_name,
        cpf_cnpj: client.cpf_cnpj,
        state_registration: client.state_registration,
        municipal_registration: client.municipal_registration || null,
        rural_registration: client.rural_registration || null,
        contacts: client.contacts.map((contact) => ({
          description: contact.description,
          contact: contact.contact,
          type: contact.type as "TELEFONE" | "CELULAR" | "EMAIL" | "WHATSAPP",
          main_account: contact.favorite,
        })),
        addresses: client.address.map((addr) => ({
          street: addr.street,
          complement: addr.complement || null,
          postal_code: addr.postal_code,
          number: addr.number,
          neighborhood: addr.neighborhood,
          municipality_id: addr.municipality_id,
        })),
        owner: {
          ...client.owner,
          birth_date: client.owner.birth_date.toISOString().split("T")[0],
        },
        representative: client.representative,
      });
    });
  }

  async findById(user_id: number): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { id: user_id },
      include: {
        contacts: true,
        address: true,
        owner: true,
        representative: true,
      },
    });

    if (!client) {
      return null;
    }

    return new ClientEntity({
      id: client.id,
      corporate_name: client.corporate_name,
      fantasy_name: client.fantasy_name,
      cpf_cnpj: client.cpf_cnpj,
      state_registration: client.state_registration,
      municipal_registration: client.municipal_registration || null,
      rural_registration: client.rural_registration || null,
      contacts: client.contacts.map((contact) => ({
        description: contact.description,
        contact: contact.contact,
        type: contact.type as "TELEFONE" | "CELULAR" | "EMAIL" | "WHATSAPP",
        main_account: contact.favorite,
      })),
      addresses: client.address.map((addr) => ({
        street: addr.street,
        complement: addr.complement || null,
        postalCode: addr.postal_code,
        number: addr.number,
        neighborhood: addr.neighborhood,
        municipalityId: addr.municipality_id,
      })),
      owner: {
        ...client.owner,
        birth_date: client.owner.birth_date.toISOString().split("T")[0],
      },
      representative: client.representative
        ? {
            id: client.representative.id,
            name: client.representative.name,
            cellphone: client.representative.cellphone,
            phone: client.representative.phone,
            email: client.representative.email,
            region: client.representative.region,
            status: client.representative.status,
            supervisor: client.representative.supervisor,
            type: client.representative.type,
          }
        : undefined,
    });
  }

  async create(createClientDto: TClient): Promise<ClientEntity> {
    await this.validateClientData(createClientDto);

    // Exemplo de como os dados estão sendo criados no Prisma
    const clientData = {
      corporate_name: createClientDto.corporate_name,
      fantasy_name: createClientDto.fantasy_name,
      cpf_cnpj: createClientDto.cpf_cnpj,
      state_registration: createClientDto.state_registration,
      municipal_registration: createClientDto.municipal_registration || null,
      rural_registration: createClientDto.rural_registration || null,
      contacts: {
        create: createClientDto.contacts.map((contact) => ({
          description: contact.description,
          contact: contact.contact,
          type: contact.type,
          favorite: contact.favorite,
        })),
      },
      address: {
        create: createClientDto.addresses.map((addr) => ({
          street: addr.street,
          complement: addr.complement || null,
          postal_code: addr.postal_code,
          number: addr.number,
          neighborhood: addr.neighborhood,
          municipality_name: addr.municipality_name,
          state: addr.state,
          description: addr.description || null,
          favorite: addr.favorite,
        })),
      },
      owner: {
        create: {
          name: createClientDto.owner.name,
          cpf_cnpj: createClientDto.owner.cpf_cnpj,
          birth_date: new Date(createClientDto.owner.birth_date).toISOString(),
        },
      },
      name_account: createClientDto.name_account,
      systemsId: createClientDto.systemsId,
      representative_id: createClientDto.representativeId,
    };
    try {
      const createdClient = await this.prisma.client.create({
        data: clientData,
        include: {
          address: true,
          owner: true,
          contacts: true,
          representative: true,
        },
      });

      console.log("==>>", createdClient.representative);

      return new ClientEntity({
        id: createdClient.id,
        corporate_name: createdClient.corporate_name,
        fantasy_name: createdClient.fantasy_name,
        cpf_cnpj: createdClient.cpf_cnpj,
        state_registration: createClientDto.state_registration || null,
        municipal_registration: createClientDto.municipal_registration || null,
        rural_registration: createClientDto.rural_registration || null,
        contacts: createdClient.contacts,
        addresses: createdClient.address,
        representative: createdClient.representative,
        owner: {
          ...createdClient.owner,
          birth_date: createdClient.owner.birth_date
            .toISOString()
            .split("T")[0],
        },
        name_account: createdClient.name_account,

        systemsId: createdClient.systemsId,
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw new BadRequestException("Erro ao criar cliente.");
    }
  }
  async checkAccountExists(id_account: number): Promise<boolean> {
    const account = await this.prisma.client.findUnique({
      where: { id: id_account },
    });
    return account !== null;
  }
  async update(
    id: number,
    updateClientDto: Partial<TClient>
  ): Promise<ClientEntity> {
    try {
      const currentClient = await this.prisma.client.findUnique({
        where: { id },
        include: {
          contacts: true,
          address: true,
          owner: true,
        },
      });

      if (!currentClient) {
        throw new NotFoundException(`Cliente com ID ${id} não foi encontrado.`);
      }

      if (
        updateClientDto.cpf_cnpj &&
        updateClientDto.cpf_cnpj !== currentClient.cpf_cnpj
      ) {
      }

      // Construct the update data
      const clientData: Prisma.ClientUpdateInput = {
        corporate_name:
          updateClientDto.corporate_name ?? currentClient.corporate_name,
        fantasy_name:
          updateClientDto.fantasy_name ?? currentClient.fantasy_name,
        cpf_cnpj: updateClientDto.cpf_cnpj ?? currentClient.cpf_cnpj,
        state_registration:
          updateClientDto.state_registration ??
          currentClient.state_registration,
        municipal_registration:
          updateClientDto.municipal_registration ??
          currentClient.municipal_registration,
        rural_registration:
          updateClientDto.rural_registration ??
          currentClient.rural_registration,
        name_account:
          updateClientDto.name_account ?? currentClient.name_account,
      };

      if (updateClientDto.owner) {
        clientData.owner = {
          upsert: {
            where: { id: currentClient.owner?.id || 0 },
            create: {
              name: updateClientDto.owner.name || "",
              cpf_cnpj: updateClientDto.owner.cpf_cnpj || "",
              birth_date: updateClientDto.owner.birth_date
                ? new Date(updateClientDto.owner.birth_date)
                : new Date(),
            },
            update: {
              name:
                updateClientDto.owner.name || currentClient.owner?.name || "",
              cpf_cnpj:
                updateClientDto.owner.cpf_cnpj ||
                currentClient.owner?.cpf_cnpj ||
                "",
              birth_date: updateClientDto.owner.birth_date
                ? new Date(updateClientDto.owner.birth_date)
                : currentClient.owner?.birth_date,
            },
          },
        };
      }

      // Update logic for contacts and addresses goes here...

      // Perform the update
      const updatedClient = await this.prisma.client.update({
        where: { id },
        data: clientData,
        include: {
          owner: true,
          address: true,
          contacts: true,
        },
      });

      // Return the updated client data
      return new ClientEntity({
        id: updatedClient.id,
        corporate_name: updatedClient.corporate_name,
        fantasy_name: updatedClient.fantasy_name,
        cpf_cnpj: updatedClient.cpf_cnpj,
        state_registration: updatedClient.state_registration,
        municipal_registration: updatedClient.municipal_registration,
        rural_registration: updatedClient.rural_registration,
        contacts: updatedClient.contacts.map((contact) => ({
          description: contact.description,
          contact: contact.contact,
          type: contact.type as "TELEFONE" | "CELULAR" | "EMAIL" | "WHATSAPP",
          main_account: contact.favorite,
        })),
        addresses: updatedClient.address.map((addr) => ({
          street: addr.street,
          complement: addr.complement,
          postalCode: addr.postal_code,
          number: addr.number,
          neighborhood: addr.neighborhood,
          municipalityId: addr.municipality_id,
          municipalityName: addr.municipality_name,
          stateId: addr.state_id,
          state: addr.state,
          countryId: addr.country_id,
          regionId: addr.region_id,
          description: addr.description,
          main: addr.favorite,
        })),
        owner: {
          name: updatedClient.owner.name,
          cpf_cnpj: updatedClient.owner.cpf_cnpj,
          birth_date: updatedClient.owner.birth_date
            .toISOString()
            .split("T")[0],
        },
        name_account: updatedClient.name_account,
        // Additional fields...
      });
    } catch (error) {
      console.error("Erro ao tentar atualizar o cliente:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `Cliente com ID ${id} não foi encontrado.`
          );
        } else if (error.code === "P2002") {
          throw new BadRequestException(
            "Conflito de dados: Verifique os campos que devem ser únicos."
          );
        }
      }

      throw new BadRequestException(
        "Erro ao tentar atualizar o cliente. Verifique os dados fornecidos."
      );
    }
  }

  async remove(id: number): Promise<{
    message: string;
  }> {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
        include: {
          contacts: true,
          address: true,
          owner: true,
        },
      });

      if (!client) {
        throw new NotFoundException(`Cliente com ID ${id} não foi encontrado.`);
      }

      await this.prisma.contact.deleteMany({ where: { clientId: id } });
      await this.prisma.address.deleteMany({ where: { clientId: id } });
      await this.prisma.owner.deleteMany({ where: { clientId: id } });

      await this.prisma.client.delete({
        where: { id },
      });

      return { message: `Cliente com ID ${id} foi excluído com sucesso.` };
    } catch (error) {
      console.error("Erro ao tentar excluir o cliente:", error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error === "P2025") {
        throw new NotFoundException(`Cliente com ID ${id} não foi encontrado.`);
      }

      if (error === "P2003") {
        throw new BadRequestException(
          `Não é possível excluir o cliente com ID ${id} porque ele possui registros relacionados.`
        );
      }

      throw new InternalServerErrorException(
        "Erro ao tentar excluir o cliente."
      );
    }
  }
  findByEmail(email: string) {
    return this.prisma.client.findFirst({
      where: {
        contacts: {
          some: {
            contact: email,
            type: "EMAIL",
          },
        },
      },
      include: {
        contacts: true,
      },
    });
  }
  findByCpfCnpj(cpf_cnpj: string) {
    return this.prisma.client.findFirst({ where: { cpf_cnpj } });
  }
  async validateContacts(contacts: TClient["contacts"], clientId?: number) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const contact of contacts.filter((c) => c.type === "EMAIL")) {
      if (!emailRegex.test(contact.contact)) {
        throw new BadRequestException(
          `O e-mail ${contact.contact} é inválido.`
        );
      }
    }
  }

  async validateClientData(clientDto: TClient, id?: number) {
    const existingClient = await this.prisma.client.findFirst({
      where: {
        cpf_cnpj: clientDto.cpf_cnpj,
        ...(id && { id: { not: id } }),
      },
    });
    if (existingClient) {
      throw new BadRequestException(
        `O CPF/CNPJ ${clientDto.cpf_cnpj} já está em uso.`
      );
    }

    if (clientDto.corporate_name === clientDto.fantasy_name) {
      throw new BadRequestException(
        "O nome fantasia não pode ser igual ao nome corporativo."
      );
    }

    const cpfCnpj = clientDto.cpf_cnpj.replace(/\D/g, "");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      throw new BadRequestException(
        "O CPF deve ter 11 dígitos e o CNPJ deve ter 14 dígitos."
      );
    }

    await this.validateContacts(clientDto.contacts);
  }

  filterClients(filters: {
    cpf_cnpj?: string;
    fantasy_name?: string;
    id?: number;
    corporate_name?: string;
  }): Promise<ClientEntity[]> {
    throw new Error("Method not implemented.");
  }
}
