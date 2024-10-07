import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class SystemsService {
  constructor(
    @Inject("ISystemRepository")
    private readonly systemRepository: any
  ) {}

  async create(data: any) {
    return this.systemRepository.create({
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      stable_version: data.stable_version,
    });
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

  findOne(id: number) {
    return this.systemRepository.findOne(id);
  }

  update(id: number, updateSystemDto: any) {
    return this.systemRepository.update(id, updateSystemDto);
  }

  remove(id: number) {
    return this.systemRepository.remove(id);
  }
}
