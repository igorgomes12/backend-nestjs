import type { TAccounting } from "../dto/schemas/zod_accounting.schema";
import type { TAddress } from "../dto/schemas/zod_address.schema";
import type { TClient } from "../dto/schemas/zod_client.schema";
import type { TContact } from "../dto/schemas/zod_contact.schema";
import type { TOwner } from "../dto/schemas/zod_owner.schema";

export type TClientProps = {
  id: number;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  corporate_name: string;
  fantasy_name: string | null;
  contacts: Array<TContact>;
  cpf_cnpj: string;
  state_registration: string;
  municipal_registration: string | null;
  rural_registration: string | null;
  address: Array<TAddress>;
  accounting: Array<TAccounting>;
  owner: Array<TOwner>;
};
export class Client {
  private constructor(private props: TClientProps) {}

  public static create(client: any) {
    // return new Client({
    //   id: Math.floor(Math.random() * 1000000),
    //   identifier: client.identifier,
    //   createdAt: client.createdAt,
    //   updatedAt: client.updatedAt,
    //   deletedAt: client.deletedAt,
    //   corporate_name: client.corporate_name,
    //   fantasy_name: client.fantasy_name,
    //   contacts: client.contacts,
    //   cpf_cnpj: client.cpf_cnpj,
    //   state_registration: client.state_registration,
    //   municipal_registration: client.municipal_registration,
    //   rural_registration: client.rural_registration,
    //   address: client.address,
    //   // accounting: client.accounting,
    //   owner: client.owner,
    // });
  }

  public get id() {
    return this.props.id;
  }

  public get identifier() {
    return this.props.identifier;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get deletedAt() {
    return this.props.deletedAt;
  }

  public get corporateName() {
    return this.props.corporate_name;
  }

  public get fantasyName() {
    return this.props.fantasy_name;
  }

  public get contacts() {
    return this.props.contacts;
  }

  public get cpfCnpj() {
    return this.props.cpf_cnpj;
  }

  static fromDTO(dto: TClientProps): Client {
    return new Client(dto);
  }

  set id(value: number) {
    this.props.id = value;
  }

  public get stateRegistration() {
    return this.props.state_registration;
  }

  public get municipalRegistration() {
    return this.props.municipal_registration;
  }

  public get ruralRegistration() {
    return this.props.rural_registration;
  }

  public get address() {
    return this.props.address;
  }

  public get accounting() {
    return this.props.accounting;
  }

  public get owner() {
    return this.props.owner;
  }

  public delete() {
    this.props.deletedAt = new Date().toISOString();
  }

  public updateContacts(contacts: Array<TContact>) {
    this.props.contacts = contacts;
  }
  public updateAddress(address: Array<TAddress>) {
    this.props.address = address;
  }
  public updateAccounting(accounting: Array<TAccounting>) {
    this.props.accounting = accounting;
  }
  public updateOwner(owner: Array<TOwner>) {
    this.props.owner = owner;
  }
  public updateCorporateName(corporateName: string) {
    this.props.corporate_name = corporateName;
  }
  public updateFantasyName(fantasyName: string | null) {
    this.props.fantasy_name = fantasyName;
  }
  public updateCpfCnpj(cpfCnpj: string) {
    this.props.cpf_cnpj = cpfCnpj;
  }
  public updateStateRegistration(stateRegistration: string) {
    this.props.state_registration = stateRegistration;
  }
  public updateMunicipalRegistration(municipalRegistration: string | null) {
    this.props.municipal_registration = municipalRegistration;
  }
  public updateRuralRegistration(ruralRegistration: string | null) {
    this.props.rural_registration = ruralRegistration;
  }
  public updateIdentifier(identifier: string) {
    this.props.identifier = identifier;
  }
  public updateCreatedAt(createdAt: string) {
    this.props.createdAt = createdAt;
  }
  public updateUpdatedAt(updatedAt: string) {
    this.props.updatedAt = updatedAt;
  }
  public updateDeletedAt(deletedAt: string | null) {
    this.props.deletedAt = deletedAt;
  }
  public updateAll(client: TClient) {
    this.update(client);
  }
  public updateContactsById(contactId: number, contact: TContact) {
    this.props.contacts = this.props.contacts.map((c) =>
      c.id === contactId ? contact : c
    );
  }
  public updateAddressById(addressId: number, address: TAddress) {
    this.props.address = this.props.address.map((a) =>
      a.id === addressId ? address : a
    );
  }
  public updateOwnerById(ownerId: number, owner: TOwner) {
    this.props.owner = this.props.owner.map((o) =>
      o.id === ownerId ? owner : o
    );
  }
  public deleteContactById(contactId: number) {
    this.props.contacts = this.props.contacts.filter((c) => c.id !== contactId);
  }
  public deleteAddressById(addressId: number) {
    this.props.address = this.props.address.filter((a) => a.id !== addressId);
  }
  public deleteOwnerById(ownerId: number) {
    this.props.owner = this.props.owner.filter((o) => o.id !== ownerId);
  }
  public static fromJSON(json: string) {
    const parsed = JSON.parse(json) as TClientProps;
    return new Client(parsed);
  }
  public static fromArray(clients: Array<TClient>) {
    return clients.map(Client.create);
  }

  public addressIncrease(address: TAddress) {
    this.props.address.push(address);
  }

  public addressDecrease(addressId: number) {
    this.props.address = this.props.address.filter((a) => a.id !== addressId);
  }

  public addContact(contact: TContact) {
    if (
      contact.type === "EMAIL" &&
      this.props.contacts.some(
        (c) => c.type === "EMAIL" && c.contact === contact.contact
      )
    ) {
      throw new Error(`Email duplicado encontrado: ${contact.contact}`);
    }
    this.props.contacts.push(contact);
  }

  public update(partialClient: Partial<TClient>) {
    Object.assign(this.props, partialClient);
  }

  public toJSON() {
    return this.props;
  }
}
