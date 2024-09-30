// systems.service.ts
import { Injectable, Inject } from "@nestjs/common";
import { TSystemSchemaDto } from "../../../../infra/http/systems/dto/system.dto";
import type { ISystemRepository } from "../../../../infra/http/systems/repositories/system.repositories";

@Injectable()
export class SystemsService {
  constructor(
    @Inject("ISystemRepository")
    private readonly systemRepository: ISystemRepository
  ) {}

  async create(data: TSystemSchemaDto) {
    return this.systemRepository.create(data);
  }

  findAll() {
    return this.systemRepository.findAll();
  }

  findByName(name: string) {
    return this.systemRepository.findByName(name);
  }

  findByVersion(version: string) {
    return this.systemRepository.findByVersion(version);
  }

  findOne(id: string) {
    return this.systemRepository.findOne(id);
  }

  update(id: string, updateSystemDto: TSystemSchemaDto) {
    return this.systemRepository.update(id, updateSystemDto);
  }

  remove(id: string) {
    return this.systemRepository.remove(id);
  }
}
