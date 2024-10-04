import { TClient } from "../dto/zod_client.schema";
import { ClientEntity } from "../entity/client.entity";

export abstract class ClientEntityService {
  abstract findAll(): Promise<ClientEntity[]>;

  abstract create(data: TClient): Promise<ClientEntity>;
  abstract update(id: number, data: TClient): Promise<ClientEntity>;

  abstract checkAccountExists(id_account: number): Promise<boolean>;

  abstract remove(id: number): Promise<{
    message: string;
  }>;
  abstract findByEmail(email: string);
  abstract findByCpfCnpj(cpf_cnpj: string);
  abstract validateContacts(contacts: TClient["contacts"]): Promise<void>;
  abstract validateClientData(clientDto: TClient, id?: number): Promise<void>;
  abstract filterClients(filters: {
    cpf_cnpj?: string;
    fantasy_name?: string;
    id?: number;
    corporate_name?: string;
  }): Promise<ClientEntity[]>;
}
