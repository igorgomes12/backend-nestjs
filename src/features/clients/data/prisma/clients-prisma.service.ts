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
  async findAll(): Promise<ClientEntity[]> {
    const clients = await this.prisma.client.findMany({
      include: {
        contacts: true,
        address: true,
        owner: true,
      },
    });
    return clients.map(
      (client) =>
        new ClientEntity({
          id: client.id,
          corporateName: client.corporate_name,
          fantasyName: client.fantasy_name,
          cpfCnpj: client.cpf_cnpj,
          stateRegistration: client.state_registration,
          municipalRegistration: client.municipal_registration || null,
          ruralRegistration: client.rural_registration || null,
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
          owners: client.owner.map((owner) => ({
            name: owner.name,
            cpf_cnpj: owner.cpf_cnpj,
            birthDate: owner.birth_date.toISOString().split("T")[0],
          })),
        })
    );
  }

  async findById(user_id: number): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { id: user_id },
      include: {
        contacts: true,
        address: true,
        owner: true,
      },
    });

    if (!client) {
      return null;
    }

    return new ClientEntity({
      id: client.id,
      corporateName: client.corporate_name,
      fantasyName: client.fantasy_name,
      cpfCnpj: client.cpf_cnpj,
      stateRegistration: client.state_registration,
      municipalRegistration: client.municipal_registration || null,
      ruralRegistration: client.rural_registration || null,
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
      owners: client.owner.map((owner) => ({
        name: owner.name,
        cpfCnpj: owner.cpf_cnpj,
        birthDate: owner.birth_date.toISOString().split("T")[0],
      })),
    });
  }

  async create(createClientDto: TClient): Promise<ClientEntity> {
    await this.validateClientData(createClientDto);

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
          main_account: contact.main_account,
        })),
      },
      address: {
        create: createClientDto.address.map((addr) => ({
          street: addr.street,
          complement: addr.complement || null,
          postal_code: addr.postal_code,
          number: addr.number,
          neighborhood: addr.neighborhood,
          municipality_id: addr.municipality_id,
          municipality_name: addr.municipality_name,
          state_id: addr.state_id,
          state: addr.state,
          country_id: addr.country_id,
          region_id: addr.region_id,
          description: addr.description || null,
          main: addr.main,
        })),
      },
      owner: {
        create: createClientDto.owner.map((owner) => ({
          name: owner.name,
          cpf_cnpj: owner.cpf_cnpj,
          birth_date: new Date(owner.birth_date),
        })),
      },
      name_account: createClientDto.name_account,
      id_account: createClientDto.id_account,
      establishment_typeId: createClientDto.establishment_typeId,
      systemsId: createClientDto.systemsId,
    };

    console.log("Dados para criação do cliente:", clientData);

    try {
      const createdClient = await this.prisma.client.create({
        data: clientData,
        include: {
          owner: true,
          address: true,
          contacts: true,
        },
      });

      return new ClientEntity({
        id: createdClient.id,
        corporateName: createdClient.corporate_name,
        fantasyName: createdClient.fantasy_name,
        cpfCnpj: createdClient.cpf_cnpj,
        stateRegistration: createdClient.state_registration,
        municipalRegistration: createdClient.municipal_registration,
        ruralRegistration: createdClient.rural_registration,
        contacts: createdClient.contacts.map((contact) => ({
          description: contact.description,
          contact: contact.contact,
          type: contact.type as "TELEFONE" | "CELULAR" | "EMAIL" | "WHATSAPP",
          main_account: contact.favorite,
        })),
        addresses: createdClient.address.map((addr) => ({
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
        owners: createdClient.owner.map((owner) => ({
          name: owner.name,
          cpfCnpj: owner.cpf_cnpj,
          birthDate: owner.birth_date,
        })),
        nameAccount: createdClient.name_account,
        idAccount: createdClient.id_account,
        establishmentTypeId: createdClient.establishment_typeId,
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
      console.log("Iniciando atualização do cliente:", id);
      console.log("Dados recebidos para atualização:", updateClientDto);

      // Obtenha o cliente atual para comparação
      const currentClient = await this.prisma.client.findUnique({
        where: { id },
        include: { contacts: true, address: true, owner: true },
      });

      if (!currentClient) {
        throw new NotFoundException(`Cliente com ID ${id} não foi encontrado.`);
      }

      // Validação dos dados do cliente
      await this.validateClientData(updateClientDto, id);

      const clientData: any = {};

      // Atualize somente os campos que foram modificados
      if (updateClientDto.corporate_name !== undefined) {
        clientData.corporate_name = updateClientDto.corporate_name;
      }
      if (updateClientDto.fantasy_name !== undefined) {
        clientData.fantasy_name = updateClientDto.fantasy_name;
      }
      if (updateClientDto.cpf_cnpj !== undefined) {
        const cpfCnpj = updateClientDto.cpf_cnpj.replace(/\D/g, "");
        if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
          throw new BadRequestException(
            "O CPF deve ter 11 dígitos e o CNPJ deve ter 14 dígitos."
          );
        }
        clientData.cpf_cnpj = updateClientDto.cpf_cnpj;
      }
      if (updateClientDto.state_registration !== undefined) {
        clientData.state_registration = updateClientDto.state_registration;
      }
      if (updateClientDto.municipal_registration !== undefined) {
        clientData.municipal_registration =
          updateClientDto.municipal_registration;
      }
      if (updateClientDto.rural_registration !== undefined) {
        clientData.rural_registration = updateClientDto.rural_registration;
      }
      if (updateClientDto.name_account !== undefined) {
        clientData.name_account = updateClientDto.name_account;
      }
      if (updateClientDto.id_account !== undefined) {
        clientData.id_account = updateClientDto.id_account;
      }
      if (updateClientDto.establishment_typeId !== undefined) {
        clientData.establishment_typeId = updateClientDto.establishment_typeId;
      }

      // Atualização de contatos
      if (updateClientDto.contacts) {
        const modifiedContacts = updateClientDto.contacts.filter((contact) => {
          const existingContact = currentClient.contacts.find(
            (c) => c.id === contact.id
          );
          return (
            !existingContact || existingContact.contact !== contact.contact
          );
        });

        await this.validateContacts(modifiedContacts, id);

        clientData.contacts = {
          upsert: modifiedContacts.map((contact) => ({
            where: { id: contact.id || 0 },
            create: {
              description: contact.description,
              contact: contact.contact,
              type: contact.type,
              main_account: contact.main_account,
            },
            update: {
              description: contact.description,
              contact: contact.contact,
              type: contact.type,
              main_account: contact.main_account,
            },
          })),
        };
      }

      // Atualização de endereços
      if (updateClientDto.address) {
        clientData.address = {
          upsert: updateClientDto.address.map((addr) => ({
            where: { id: addr.id || 0 },
            create: {
              street: addr.street,
              complement: addr.complement || null,
              postal_code: addr.postal_code,
              number: addr.number,
              neighborhood: addr.neighborhood,
              municipality_id: addr.municipality_id,
              municipality_name: addr.municipality_name,
              state_id: addr.state_id,
              state: addr.state,
              country_id: addr.country_id,
              region_id: addr.region_id,
              description: addr.description || null,
              main: addr.main,
            },
            update: {
              street: addr.street,
              complement: addr.complement || null,
              postal_code: addr.postal_code,
              number: addr.number,
              neighborhood: addr.neighborhood,
              municipality_id: addr.municipality_id,
              municipality_name: addr.municipality_name,
              state_id: addr.state_id,
              state: addr.state,
              country_id: addr.country_id,
              region_id: addr.region_id,
              description: addr.description || null,
              main: addr.main,
            },
          })),
        };
      }

      // Atualização de proprietários
      if (updateClientDto.owner) {
        clientData.owner = {
          upsert: updateClientDto.owner.map((owner) => ({
            where: { id: owner.id || 0 },
            create: {
              name: owner.name,
              cpf_cnpj: owner.cpf_cnpj,
              birth_date: new Date(owner.birth_date),
            },
            update: {
              name: owner.name,
              cpf_cnpj: owner.cpf_cnpj,
              birth_date: new Date(owner.birth_date),
            },
          })),
        };
      }

      console.log("Dados finais preparados para atualização:", clientData);

      const updatedClient = await this.prisma.client.update({
        where: { id },
        data: clientData,
        include: {
          owner: true,
          address: true,
          contacts: true,
        },
      });

      console.log("Cliente atualizado com sucesso:", updatedClient);

      return new ClientEntity({
        id: updatedClient.id,
        corporateName: updatedClient.corporate_name,
        fantasyName: updatedClient.fantasy_name,
        cpfCnpj: updatedClient.cpf_cnpj,
        stateRegistration: updatedClient.state_registration,
        municipalRegistration: updatedClient.municipal_registration,
        ruralRegistration: updatedClient.rural_registration,
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
        owners: updatedClient.owner.map((owner) => ({
          name: owner.name,
          cpfCnpj: owner.cpf_cnpj,
          birthDate: owner.birth_date,
        })),
        nameAccount: updatedClient.name_account,
        idAccount: updatedClient.id_account,
        establishmentTypeId: updatedClient.establishment_typeId,
        systemsId: updatedClient.systemsId,
      });
    } catch (error) {
      console.error("Erro ao tentar atualizar o cliente:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `Cliente com ID ${id} não foi encontrado.`
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

    const onlyNumbersRegex = /^\d+$/;

    if (
      !clientDto.state_registration ||
      clientDto.state_registration.length > 20 ||
      !onlyNumbersRegex.test(clientDto.state_registration)
    ) {
      throw new BadRequestException(
        "Inscrição Estadual é obrigatória, deve ter máximo 20 dígitos e conter apenas números."
      );
    }

    const existingStateRegistration = await this.prisma.client.findFirst({
      where: {
        state_registration: clientDto.state_registration,
        ...(id && { id: { not: id } }),
      },
    });

    if (existingStateRegistration) {
      throw new BadRequestException(
        `A Inscrição Estadual ${clientDto.state_registration} já está em uso.`
      );
    }

    if (
      clientDto.rural_registration &&
      (clientDto.rural_registration.length > 20 ||
        !onlyNumbersRegex.test(clientDto.rural_registration))
    ) {
      throw new BadRequestException(
        "Inscrição Rural deve ter no máximo 20 dígitos e conter apenas números."
      );
    }

    if (
      clientDto.municipal_registration &&
      (clientDto.municipal_registration.length > 20 ||
        !onlyNumbersRegex.test(clientDto.municipal_registration))
    ) {
      throw new BadRequestException(
        "Inscrição Municipal deve ter máximo 20 dígitos e conter apenas números."
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
