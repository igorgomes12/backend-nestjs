import { Injectable, NotFoundException } from "@nestjs/common";
import { RepresentativeServiceTypes } from "../services/representative.repositories";

@Injectable()
export class FindRepresentativeByIdUseCase {
  constructor(private readonly service: RepresentativeServiceTypes) {}

  async execute(id: number) {
    const representative = await this.service.findById(id);
    if (!representative) {
      throw new NotFoundException(`Representante com ID ${id} não encontrado`);
    }
    return representative;
  }
}
