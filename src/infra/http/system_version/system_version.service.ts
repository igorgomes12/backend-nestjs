import { Inject, Injectable } from "@nestjs/common";
import { TSystemVersionSchemaDto } from "./dto/system_version.dtos";
import { ISystemVersionRepository } from "./repositories/system_version.repositories";

@Injectable()
export class SystemVersionService {
  constructor(
    @Inject("ISystemVersionRepository")
    private readonly DtoSchema: ISystemVersionRepository
  ) {}
  async create(data: TSystemVersionSchemaDto) {
    return this.DtoSchema.create(data);
  }

  findAll() {
    return this.DtoSchema.findAll();
  }

  findOne(id: number) {
    return this.DtoSchema.findOne(id);
  }

  update(id: number, updateSystemVersionDto: TSystemVersionSchemaDto) {
    return this.DtoSchema.update(id, updateSystemVersionDto);
  }

  remove(id: number) {
    return this.DtoSchema.remove(id);
  }
}
