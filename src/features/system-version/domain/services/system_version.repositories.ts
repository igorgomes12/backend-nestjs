import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";

export abstract class SystemVersionRepository {
  abstract findAll(): Promise<TSystemVersionSchemaDto[]>;
  abstract findOne(id: number): Promise<TSystemVersionSchemaDto | null>;
  abstract findByName(name: string): Promise<TSystemVersionSchemaDto | null>;
  abstract findByVersion(
    version: string
  ): Promise<TSystemVersionSchemaDto | null>;
  abstract create(
    data: TSystemVersionSchemaDto
  ): Promise<TSystemVersionSchemaDto>;
  abstract update(
    id: number,
    data: TSystemVersionSchemaDto
  ): Promise<TSystemVersionSchemaDto>;
  abstract remove(id: number): Promise<{ message: string }>;
}
