export class AccountingFindAllEntity {
  id: number;
  name: string;
  phone: string;
  email: string;
  contact: string;
  crc: string;
  cnpj: string;
  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    contact: string,
    crc: string,
    cnpj: string
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.contact = contact;
    this.crc = crc;
    this.cnpj = cnpj;
  }
}
