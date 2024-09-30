import { SystemVersion } from "../entities/system_version.entity";
import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";

export class SystemMapper {
  static toEntity(dto: TSystemVersionSchemaDto): SystemVersion {
    return new SystemVersion({
      system_id: dto.system_id,
      version_number: dto.version,
      release_date: dto.release_date,
      description: dto.description,
    });
  }

  static toDto(entity: SystemVersion): TSystemVersionSchemaDto {
    return {
      description: entity.description,
      release_date: entity.release_date,
      version: entity.version_number,
      system_id: entity.system_id,
      id: entity.id,
    };
  }
}
