import type { TSchemaEstablished } from "../dto/create-establishment.dto";
import type { EstablishmentEntity } from "../entity/establishment.entity";

export abstract class EstablishmentTypeService {
  abstract findAll(params: TSchemaEstablished): Promise<EstablishmentEntity[]>;
  abstract findById(id: number): Promise<EstablishmentEntity | null>;
  abstract create(user: TSchemaEstablished): Promise<EstablishmentEntity>;
  abstract update(
    id: number,
    user: Partial<EstablishmentEntity>
  ): Promise<EstablishmentEntity>;
  abstract delete(id: number): Promise<void>;
  abstract findByName(name: string): Promise<EstablishmentEntity | null>;
}
