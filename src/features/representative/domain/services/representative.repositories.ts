import type { CreateRepresentativeSchemaDto } from "../dto/create-representative.dto";
import type { CreateRepresentativeEntity } from "../entity/create-representative.entity";
import {
  RepresentativeEntity,
  type RepresentativeType,
} from "../entity/representative.entity";

export abstract class RepresentativeServiceTypes {
  abstract findall(): Promise<RepresentativeEntity[]>;
  abstract findByName(name: string): Promise<RepresentativeEntity | null>;

  abstract findById(id: number): Promise<RepresentativeEntity | null>;

  abstract create(
    data: CreateRepresentativeSchemaDto
  ): Promise<CreateRepresentativeEntity>;
  abstract update(
    id: number,
    data: RepresentativeEntity
  ): Promise<RepresentativeEntity>;
  abstract remove(id: number): Promise<void>;

  abstract findByType(
    type: RepresentativeType
  ): Promise<RepresentativeEntity[]>;
}
