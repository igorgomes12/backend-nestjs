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

    // Remova a verificação de status
    // if (!status) {
    //   throw new BadRequestException("Status inválido");
    // }

    if (name !== undefined && (name === null || name.length < 1)) {
      throw new BadRequestException("Nome inválido");
    }

    // Se o nome for fornecido, verifique se já existe
    if (name !== undefined) {
      const exist = await this.service.findByName(name);
      if (exist && exist.id !== id) {
        throw new BadRequestException("Nome já existe");
      }
    }

    // Busque o estabelecimento existente
    const existingEstablishment = await this.service.findById(id);
    if (!existingEstablishment) {
      throw new BadRequestException("Estabelecimento não encontrado");
    }

    // Prepare os dados para atualização
    const updateData: Partial<EstablishmentEntity> = {};
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;

    // Atualize apenas os campos fornecidos
    return this.service.update(id, updateData);
  }
}
