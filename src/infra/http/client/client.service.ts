import { PrismaService } from "@infra/database/prisma/prisma.service";
import {
  ClientSchema,
  type TClient,
} from "@infra/http/client/dto/schemas/zod_client.schema";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
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

  // Método para buscar cliente pelo CPF/CNPJ
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
      if (existingContact) {
        throw new BadRequestException(
          `O e-mail ${contact.contact} já está em uso.`
        );
      }
    }
  }

  async create(createClientDto: TClient) {
    await this.validateContacts(createClientDto.contacts);
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
      accounting: {
        create: createClientDto.accounting.map((acc) => ({
          observation: acc.observation || null,
          establishment_type_id: acc.establishment_type_id,
          taxation_type_id: acc.taxation_type_id || null,
          status: acc.status,
          company_id: acc.company_id || 1,
          representative_id: acc.representative_id || null,
          owner_id: acc.owner_id || null,
        })),
      },
      owner: {
        create: createClientDto.owner.map((owner) => ({
          name: owner.name,
          cpf_cnpj: owner.cpf_cnpj,
          birth_date: new Date(owner.birth_date),
        })),
      },
    };

    try {
      return await this.prisma.client.create({
        data: clientData,
        include: {
          owner: true,
          address: true,
          accounting: true,
          contacts: true,
        },
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw new BadRequestException("Erro ao criar cliente.");
    }
  }

  // Método para buscar todos os clientes
  async findAll() {
    return this.prisma.client.findMany({
      include: {
        owner: true,
        address: true,
        accounting: true,
        contacts: true,
      },
    });
  }

  // Método para buscar um cliente por ID
  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return client;
  }

  // Método para atualizar um cliente

  async update(id: number, updateClientDto: any) {
    try {
      const parsedClientData = ClientSchema.parse(updateClientDto);
      const clientData = {
        corporate_name: parsedClientData.corporate_name,
        fantasy_name: parsedClientData.fantasy_name,
        contacts: {
          update: parsedClientData.contacts?.map((contact) => ({
            where: { id: contact.id },
            data: {
              description: contact.description,
              contact: contact.contact,
              type: contact.type,
              main_account: contact.main_account,
            },
          })),
        },
      };

      return await this.prisma.client.update({
        where: { id },
        data: clientData,
      });
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

      // Handle other errors
      throw new BadRequestException(
        "Erro ao tentar atualizar o cliente. Verifique os dados fornecidos."
      );
    }
  }

  // Método para remover um cliente
  async remove(id: number) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
        include: {
          contacts: true,
          address: true,
          accounting: true,
          owner: true,
        },
      });

      if (!client) {
        throw new NotFoundException(`Cliente com ID ${id} não foi encontrado.`);
      }

      // Exclui os registros relacionados antes de excluir o cliente
      await this.prisma.contact.deleteMany({ where: { clientId: id } });
      await this.prisma.address.deleteMany({ where: { clientId: id } });
      await this.prisma.accounting.deleteMany({ where: { clientId: id } });
      await this.prisma.owner.deleteMany({ where: { clientId: id } });

      // Agora exclua o cliente
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
