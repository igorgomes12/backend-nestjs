export type EstablishmentInput = {
  name: string;
  status: boolean;
};

export type EstablishmentOutput = {
  id: number;
  name: string;
  status: boolean;
};

export class EstablishmentEntity {
  id: number;
  name: string;
  status: boolean;

  constructor(input: EstablishmentOutput) {
    this.name = input.name;
    this.status = input.status;
    this.id = input.id;
  }
  public async toOutput(): Promise<EstablishmentOutput> {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
    };
  }
}
