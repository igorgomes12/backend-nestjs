import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { RepresentativeServiceTypes } from "../services/representative.repositories";
import { RepresentativeEntity } from "../entity/representative.entity";

@Injectable()
export class FindAllRepresentativesUseCase {
  constructor(private readonly service: RepresentativeServiceTypes) {}

  async execute(): Promise<RepresentativeEntity[]> {
    try {
      const representatives = await this.service.findall();
      if (!representatives || representatives.length === 0) {
        throw new NotFoundException("Não existem representantes");
      }
      return representatives;
    } catch (error) {
      throw new InternalServerErrorException(
        "O erro ocorreu ao buscar os representantes"
      );
    }
  }
}
