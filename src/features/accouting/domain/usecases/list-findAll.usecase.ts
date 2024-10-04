import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { TAccountingSchema } from "../dto/accounting_zod";
import { AccountingFindAllEntity } from "../entity/accouting-findAll.entity";
import { AccoutingServiceMethods } from "../services/accouting.service";

@Injectable()
export class ListFindAllUseCase {
  constructor(
    @Inject("AccoutingServiceMethods")
    private readonly service: AccoutingServiceMethods
  ) {}

  async execute(data: TAccountingSchema): Promise<AccountingFindAllEntity[]> {
    try {
      const result = await this.service.findAll({
        ...data,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
