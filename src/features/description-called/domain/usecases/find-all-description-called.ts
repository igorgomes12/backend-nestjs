import { BadRequestException, Injectable } from "@nestjs/common";
import { DescriptionCalledService } from "../services/description-called.service";
import { DescriptionCalledEntity } from "../entity/description-called-entity";

@Injectable()
export class FindAllDescriptionCalledUseCase {
  constructor(private readonly service: DescriptionCalledService) {}

  async execute(): Promise<DescriptionCalledEntity[]> {
    try {
      return await this.service.findAll();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Consider handling unexpected errors as well
      throw new Error("An unexpected error occurred."); // Generic error handling
    }
  }
}
