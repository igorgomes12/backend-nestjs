import type { TSystemSchemaDto } from "../dto/system.dto";

export interface ISystemRepository {
  findAll(): Promise<TSystemSchemaDto[]>;
  findOne(id: number): Promise<TSystemSchemaDto | null>;
  findByName(name: string): Promise<TSystemSchemaDto | null>;
  findByVersion(version: string): Promise<TSystemSchemaDto | null>;
  create(data: TSystemSchemaDto): Promise<TSystemSchemaDto>;
  update(id: number, data: TSystemSchemaDto): Promise<TSystemSchemaDto>;
  remove(id: number): Promise<{ message: string }>;
}
