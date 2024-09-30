export type TInput = {
  name: string;
  cnpj: string;
  contact: string;
  crc: string;
  email: string;
  phone: string;
};

export type TOutput = {
  id: number;
  name: string;
  cnpj: string;
  contact: string;
  crc: string;
  email: string;
  phone: string;
};

export class AccoutingEntities {
  id: number;
  name: string;
  cnpj: string;
  contact: string;
  crc: string;
  email: string;
  phone: string;

  constructor(data: TOutput) {
    this.id = data.id;
    this.name = data.name;
    this.cnpj = data.cnpj;
    this.contact = data.contact;
    this.crc = data.crc;
    this.email = data.email;
    this.phone = data.phone;
  }
  public async toOutput(): Promise<TOutput> {
    return {
      id: this.id,
      name: this.name,
      cnpj: this.cnpj,
      contact: this.contact,
      crc: this.crc,
      email: this.email,
      phone: this.phone,
    };
  }
}
