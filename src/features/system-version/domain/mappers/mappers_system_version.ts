import { TSystemVersionSchemaDto } from "../dto/system_version.dtos";
import { SystemVersionEntity } from "../entity/system_version.entity";

export class SystemMapper {
  static toEntity(dto: TSystemVersionSchemaDto): SystemVersionEntity {
    return new SystemVersionEntity({
      system_id: dto.system_id,
      version_number: dto.version,
      release_date: dto.release_date,
      description: dto.description,
    });
  }

  static toDto(entity: SystemVersionEntity): TSystemVersionSchemaDto {
    return {
      description: entity.description,
      release_date: entity.release_date,
      version: entity.version_number,
      system_id: entity.system_id,
    };
  }
}
