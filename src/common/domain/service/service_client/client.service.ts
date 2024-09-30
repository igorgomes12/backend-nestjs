import type { TClient } from "@common/domain/entities/entities_client/zod_client.schema";
import { PrismaService } from "@infra/auth/database/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import z from "zod";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string) {
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

  async findByCpfCnpj(cpf_cnpj: string) {
    return this.prisma.client.findFirst({
      where: {
        cpf_cnpj,
      },
    });
  }

  async validateContacts(contacts: TClient["contacts"]) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailContacts = contacts.filter(
      (contact) => contact.type === "EMAIL"
    );

    for (const contact of emailContacts) {
      if (contact.contact === "teste@teste") {
        throw new BadRequestException(
          `O e-mail ${contact.contact} não é permitido.`
        );
      }

      if (!emailRegex.test(contact.contact)) {
        throw new BadRequestException(
          `O e-mail ${contact.contact} é inválido.`
        );
      }

      const existingContact = await this.prisma.contact.findFirst({
        where: { contact: contact.contact },
      });

      if (existingContact) {
        throw new BadRequestException(
          `O e-mail ${contact.contact} já está em uso.`
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

  async create(createClientDto: TClient) {
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

    try {
      return await this.prisma.client.create({
        data: clientData,
        include: {
          owner: true,
          address: true,
          contacts: true,
        },
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw new BadRequestException("Erro ao criar cliente.");
    }
  }

  async filterClients(filters: {
    cpf_cnpj?: string;
    fantasy_name?: string;
    id?: number;
    corporate_name?: string;
  }) {
    const { cpf_cnpj, fantasy_name, id, corporate_name } = filters;

    const clients = await this.prisma.client.findMany({
      where: {
        ...(cpf_cnpj && { cpf_cnpj }),
        ...(fantasy_name && {
          fantasy_name: { contains: fantasy_name, mode: "insensitive" },
        }),
        ...(id && { id: id }),
        ...(corporate_name && {
          corporate_name: { contains: corporate_name, mode: "insensitive" },
        }),
      },
      orderBy: {
        id: "asc",
      },
      take: 100,
      include: {
        contacts: true,
        address: true,
        owner: true,
      },
    });

    if (clients.length === 0) {
      throw new NotFoundException(
        "Nenhum cliente encontrado com os critérios fornecidos."
      );
    }

    return clients;
  }

  async findAll() {
    return this.prisma.client.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        owner: true,
        address: true,
        contacts: true,
      },
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return client;
  }

  async update(id: number, updateClientDto: Partial<TClient>) {
    try {
      console.log("Iniciando atualização do cliente:", id);
      console.log("Dados recebidos para atualização:", updateClientDto);

      // Preparar dados do cliente para atualização
      const clientData: any = {};

      // Atualizar apenas os campos presentes no DTO
      if (updateClientDto.corporate_name !== undefined) {
        clientData.corporate_name = updateClientDto.corporate_name;
      }
      if (updateClientDto.fantasy_name !== undefined) {
        clientData.fantasy_name = updateClientDto.fantasy_name;
      }
      if (updateClientDto.cpf_cnpj !== undefined) {
        // Validação de CPF/CNPJ se necessário
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

      console.log("Dados preparados para atualização:", clientData);

      // Atualizar contatos se fornecidos
      if (updateClientDto.contacts) {
        clientData.contacts = {
          upsert: updateClientDto.contacts.map((contact) => ({
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

      // Atualizar endereços se fornecidos
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

      // Atualizar proprietários se fornecidos
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

      // Realizar a atualização do cliente
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
      return updatedClient;
    } catch (error) {
      console.error("Erro ao tentar atualizar o cliente:", error);

      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(
          (e) => `${e.path.join(".")} is required`
        );
        throw new BadRequestException(
          `Erro de validação: ${validationErrors.join(", ")}`
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Tratar erros conhecidos do Prisma
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
  async remove(id: number) {
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
}
