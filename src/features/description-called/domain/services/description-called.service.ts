// Importing types
import type { TDescriptionCalledSchema } from "../dto/description-called-dto";
import type { DescriptionCalledEntity } from "../entity/description-called-entity";

export abstract class DescriptionCalledService {
  abstract findAll(): Promise<DescriptionCalledEntity[]>;

  abstract findById(id: number): Promise<DescriptionCalledEntity>;

  abstract create(
    data: Omit<TDescriptionCalledSchema, "id">
  ): Promise<DescriptionCalledEntity>;

  abstract update(
    id: number,
    data: Partial<Omit<TDescriptionCalledSchema, "id">>
  ): Promise<DescriptionCalledEntity>;

  abstract delete(id: number): Promise<void>;
}
