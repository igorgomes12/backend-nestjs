import type { TDescriptionCalledSchema } from "../dto/description-called-dto";

export class DescriptionCalledEntity implements TDescriptionCalledSchema {
  public id?: number;
  public public_id?: string;
  public description: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date | null;

  constructor(data: Partial<TDescriptionCalledSchema>) {
    Object.assign(this, data);
  }
}
