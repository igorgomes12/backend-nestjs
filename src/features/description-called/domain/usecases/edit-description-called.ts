import { Injectable } from "@nestjs/common";
import { DescriptionCalledService } from "../services/description-called.service";
import { DescriptionCalledEntity } from "../entity/description-called-entity";

@Injectable()
export class EditDescriptionCalledUseCase {
  constructor(private readonly service: DescriptionCalledService) {}
  async execute(id: number, data: DescriptionCalledEntity) {
    try {
      await this.service.update(id, data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
