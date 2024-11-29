import { Injectable } from "@nestjs/common";
import { DescriptionCalledService } from "../services/description-called.service";

@Injectable()
export class DeleteDescriptionCalledUseCase {
  constructor(private readonly service: DescriptionCalledService) {}
  async execute(id: number) {
    try {
      await this.service.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
