import type { TSchemaEstablished } from "features/establishment/domain/dto/create-establishment.dto.js";
import type { TSystemSchemaDto } from "features/systems/domain/dto/system.dto.js";
import type { TAccounting } from "../dto/zod_accounting.schema.js";
import type { TAddress } from "../dto/zod_address.schema.js";
import type { TContact } from "../dto/zod_contact.schema.js";
import type { TOwner } from "../dto/zod_owner.schema.js";
import type { RepresentativeEntity } from "features/representative/domain/entity/representative.entity.js";

export class ClientEntity {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
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
  owner: TOwner;
  establishmentType?: TSchemaEstablished;
  accounting?: TAccounting;
  systems?: TSystemSchemaDto;
  representative?: RepresentativeEntity;

  constructor(data: Partial<ClientEntity>) {
    this.id = data.id;
    this.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt || "");
    this.updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : new Date(data.updatedAt || "");
    this.deletedAt = data.deletedAt
      ? data.deletedAt instanceof Date
        ? data.deletedAt
        : new Date(data.deletedAt)
      : null;
    this.corporate_name = data.corporate_name!;
    this.fantasy_name = data.fantasy_name;
    this.cpf_cnpj = data.cpf_cnpj!;
    this.state_registration = data.state_registration ?? null;
    this.municipal_registration = data.municipal_registration;
    this.rural_registration = data.rural_registration;
    this.name_account = data.name_account!;
    this.idAccount = data.idAccount;
    this.establishmentTypeId = data.establishmentTypeId;
    this.systemsId = data.systemsId;
    this.contacts = data.contacts!;
    this.addresses = data.addresses!;
    this.owner = data.owner!;
    this.establishmentType = data.establishmentType;
    this.accounting = data.accounting;
    this.systems = data.systems;
    this.representative = data.representative;
  }
}
