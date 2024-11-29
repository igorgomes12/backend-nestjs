import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { DescriptionCalledService } from "../services/description-called.service";
import { DescriptionCalledEntity } from "../entity/description-called-entity";
import type { TDescriptionCalledSchema } from "../dto/description-called-dto";

@Injectable()
export class CreateDescriptionCalledUseCase {
  constructor(private readonly service: DescriptionCalledService) {}

  async execute(
    data: TDescriptionCalledSchema
  ): Promise<DescriptionCalledEntity> {
    try {
      const descriptionCalled = await this.service.create(data);
      return descriptionCalled;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          "Invalid data provided. Please check your input and try again."
        );
      } else if (error === "P2002") {
        // Assuming Prisma's unique constraint violation error
        throw new ConflictException(
          "A description with this name already exists. Please choose a different name."
        );
      } else {
        throw new InternalServerErrorException(
          "An unexpected error occurred while creating the description. Please try again later."
        );
      }
    }
  }
}
