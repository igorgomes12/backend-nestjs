import type { TOwner } from "../dto/zod_owner.schema";
import type { TAddress } from "../dto/zod_address.schema";
import type { TContact } from "../dto/zod_contact.schema";
import type { TAccounting } from "../dto/zod_accounting.schema";
import type { TSystemSchemaDto } from "@infra/http/modules/systems/dto/system.dto";
import type { SchemaEstablished } from "@infra/http/modules/establishment/dto/create-establishment.dto";

export class ClientEntity {
  id?: number;
  identifier?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  corporateName: string;
  fantasyName?: string;
  cpfCnpj: string;
  stateRegistration: string;
  municipalRegistration?: string | null;
  ruralRegistration?: string | null;
  nameAccount: string;
  idAccount: number;
  establishmentTypeId: number;
  systemsId: number;
  contacts: TContact[];
  addresses: TAddress[];
  owners: TOwner[];
  establishmentType?: SchemaEstablished;
  accounting?: TAccounting;
  systems?: TSystemSchemaDto;

  constructor(data: Partial<ClientEntity>) {
    Object.assign(this, data);
  }
}
