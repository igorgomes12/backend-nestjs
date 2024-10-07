import { Injectable } from "@nestjs/common";
import { EstablishmentTypeService } from "../services/establishment-type.sevice";

@Injectable()
export class DeleteEstablishmentUsecase {
  constructor(private readonly service: EstablishmentTypeService) {}
  async execute(id: number) {
    const res = await this.service.findById(id);

    if (!res) {
      throw new Error("Estabelecimento não encontrado");
    }

    await this.service.delete(id);
  }
}
