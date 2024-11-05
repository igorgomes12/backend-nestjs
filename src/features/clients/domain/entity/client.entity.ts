import type { TSchemaEstablished } from "features/establishment/domain/dto/create-establishment.dto.js";
import type { TSystemSchemaDto } from "features/systems/domain/dto/system.dto.js";
import type { TAccounting } from "../dto/zod_accounting.schema.js";
import type { TAddress } from "../dto/zod_address.schema.js";
import type { TContact } from "../dto/zod_contact.schema.js";
import type { TOwner } from "../dto/zod_owner.schema.js";

export class ClientEntity {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
  corporate_name: string;
  fantasy_name?: string;
  cpf_cnpj: string;
  state_registration: string | null;
  municipal_registration?: string | null;
  rural_registration?: string | null;
  name_account: string;
  idAccount: number;
  establishmentTypeId: number;
  systemsId: number;
  contacts: TContact[];
  addresses: TAddress[];
  owners: TOwner;
  establishmentType?: TSchemaEstablished;
  accounting?: TAccounting;
  systems?: TSystemSchemaDto;
  representativeName?: string;

  constructor(data: Partial<ClientEntity>) {
    Object.assign(this, data);
  }
}
