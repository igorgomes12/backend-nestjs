import { TSystemVersionSchemaDto } from "@infra/http/system_version/dto/system_version.dtos";
import { ISystemVersionRepository } from "@infra/http/system_version/repositories/system_version.repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SystemVersionService {
  constructor(
    @Inject("ISystemVersionRepository")
    private readonly systemVersionRepository: ISystemVersionRepository
  ) {}

  async create(data: TSystemVersionSchemaDto) {
    return this.systemVersionRepository.create(data);
  }

  findAll() {
    return this.systemVersionRepository.findAll();
  }

  findByVersion(version: string) {
    return this.systemVersionRepository.findByVersion(version);
  }

  findOne(id: number) {
    return this.systemVersionRepository.findOne(id);
  }

  update(id: number, updateSystemVersionDto: TSystemVersionSchemaDto) {
    return this.systemVersionRepository.update(id, updateSystemVersionDto);
  }

  remove(id: number) {
    return this.systemVersionRepository.remove(id);
  }
}
