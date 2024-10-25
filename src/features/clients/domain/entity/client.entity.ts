import { TSchemaEstablished } from "features/establishment/domain/dto/create-establishment.dto";
import { TSystemSchemaDto } from "features/systems/domain/dto/system.dto";
import { TAccounting } from "../dto/zod_accounting.schema";
import { TAddress } from "../dto/zod_address.schema";
import { TContact } from "../dto/zod_contact.schema";
import { TOwner } from "../dto/zod_owner.schema";

export class ClientEntity {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
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
  establishmentType?: TSchemaEstablished;
  accounting?: TAccounting;
  systems?: TSystemSchemaDto;

  constructor(data: Partial<ClientEntity>) {
    Object.assign(this, data);
  }
}
