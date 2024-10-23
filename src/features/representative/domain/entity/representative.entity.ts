import type { AddressRepresentativeSchemaDto } from "../dto/address-representative.dto";
import type { CommissionRepresentativeDto } from "../dto/commission-representative.dto";
import type { ContactRepresentativeDto } from "../dto/contact-representative.dto";

export type RepresentativeType = "REPRESENTATIVE" | "CONSULTANT" | "PARTHER";

export class RepresentativeEntity {
  public readonly id?: number;
  public name: string;
  public cellphone: string;
  public phone: string;
  public supervisor?: string;
  public status: string;
  public type: RepresentativeType;
  public region: string;
  public commission?: CommissionRepresentativeDto;
  public contact?: ContactRepresentativeDto;
  public address?: AddressRepresentativeSchemaDto;
  public created_at?: Date;

  constructor(props: Omit<RepresentativeEntity, "id"> & { id?: number }) {
    Object.assign(this, props);
  }
}
