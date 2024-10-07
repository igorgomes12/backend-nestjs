import { TSystemSchemaDto } from "../dto/system.dto";

export abstract class SystemRepository {
  abstract findAll(): Promise<TSystemSchemaDto[]>;
  abstract findOne(id: number): Promise<TSystemSchemaDto | null>;
  abstract findByName(name: string): Promise<TSystemSchemaDto | null>;
  abstract findByVersion(version: string): Promise<TSystemSchemaDto | null>;
  abstract create(data: TSystemSchemaDto): Promise<TSystemSchemaDto>;
  abstract update(
    id: number,
    data: TSystemSchemaDto
  ): Promise<TSystemSchemaDto>;
  abstract remove(id: number): Promise<{ message: string }>;
}
