import { BadRequestException, Injectable } from "@nestjs/common";
import { EstablishmentEntity } from "../entity/establishment.entity";
import { EstablishmentTypeService } from "../services/establishment-type.sevice";

@Injectable()
export class UpdateEstablishmentUsecase {
  constructor(private readonly service: EstablishmentTypeService) {}
  async execute(
    id: number,
    data: Partial<EstablishmentEntity>
  ): Promise<EstablishmentEntity> {
    const { name, status } = data;
    if (!status) {
      throw new BadRequestException("Status inválido");
    }
    if (!name || name.length < 1) {
      throw new BadRequestException("Nome inválido");
    }
    const exist = await this.service.findByName(name);
    if (exist && exist.id !== id) {
      throw new BadRequestException("Nome ja existe");
    }
    return this.service.update(id, data);
  }
}
