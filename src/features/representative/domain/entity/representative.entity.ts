export type RepresentativeType = "REPRESENTATIVE" | "CONSULTANT" | "PARTHER";

export class RepresentativeEntity {
  public readonly id?: number;
  public name: string;
  public cellphone: string;
  public phone: string;
  public type: RepresentativeType;
  public region: string;

  constructor(props: Omit<RepresentativeEntity, "id"> & { id?: number }) {
    Object.assign(this, props);
  }
}
