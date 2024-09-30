import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";

export interface ISystemVersionRepository {
  findAll(): Promise<TSystemVersionSchemaDto[]>;
  findOne(id: number): Promise<TSystemVersionSchemaDto | null>;
  findByName(name: string): Promise<TSystemVersionSchemaDto | null>;
  findByVersion(version: string): Promise<TSystemVersionSchemaDto | null>;
  create(data: TSystemVersionSchemaDto): Promise<TSystemVersionSchemaDto>;
  update(
    id: number,
    data: TSystemVersionSchemaDto
  ): Promise<TSystemVersionSchemaDto>;
  remove(id: number): Promise<{ message: string }>;
}
