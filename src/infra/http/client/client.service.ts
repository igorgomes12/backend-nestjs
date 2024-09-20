import { PrismaService } from "@infra/database/prisma/prisma.service";
import type { TClient } from "@infra/http/client/dto/schemas/zod_client.schema";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  
   async validateContacts(contacts: TClient['contacts']) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   
    const emailContacts = contacts.filter(contact => contact.type === 'EMAIL');
   
    for (const contact of emailContacts) {

      if (!emailRegex.test(contact.contact)) {
        throw new BadRequestException(`O e-mail ${contact.contact} é inválido.`);
      }

      const existingContact = await this.prisma.contact.findFirst({
        where: { contact: contact.contact },
      });

      if (existingContact) {
        throw new BadRequestException(`O e-mail ${contact.contact} já está em uso.`);
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
        create: createClientDto.contacts.map(contact => ({
          description: contact.description,
          contact: contact.contact,
          type: contact.type,
          main_account: contact.main_account,
        })),
      },
      address: {
        create: createClientDto.address.map(addr => ({
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
        create: createClientDto.accounting.map(acc => ({
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
        create: createClientDto.owner.map(owner => ({
          name: owner.name,
          cpf_cnpj: owner.cpf_cnpj,
          birth_date: new Date(owner.birth_date),  // Converte para objeto Date
        })),
      },
    };
    
    try {
      return await this.prisma.client.create({
        data: clientData,
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw new BadRequestException('Erro ao criar cliente.');
    }

    try {
      return await this.prisma.client.create({
        data: clientData,
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw new BadRequestException('Erro ao criar cliente.');
    }
  }

  // Método para buscar todos os clientes
  async findAll() {
    return this.prisma.client.findMany();
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
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  // Método para remover um cliente
  async remove(id: number) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}