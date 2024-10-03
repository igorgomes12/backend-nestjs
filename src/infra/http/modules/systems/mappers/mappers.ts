import { TSystemSchemaDto } from "../dto/system.dto";
import { System } from "@common/domain/entities/entities_system/system.entity";

export class SystemMapper {
  static toEntity(dto: TSystemSchemaDto): System {
    return new System({
      name: dto.name,
    });
  }

  static toDto(entity: System): TSystemSchemaDto {
    return {
      name: entity.name,
    };
  }
}
