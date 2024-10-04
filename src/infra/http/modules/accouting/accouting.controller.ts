import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { CreateAccountingUseCase } from "features/accouting/domain/usecases/create-accounting.usecase";
import { DeleteAccountUsecase } from "features/accouting/domain/usecases/delete-accounting.usecase";
import { ListFindAllUseCase } from "features/accouting/domain/usecases/list-findAll.usecase";
import { UpdateAccountingUseCase } from "features/accouting/domain/usecases/update-acoounting.usecase";
import {
  AccountingSchema,
  TAccountingSchema,
} from "../../../../features/accouting/domain/dto/accounting_zod";

@Controller("accouting")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class AccoutingController {
  constructor(
    private readonly listFindAllUseCase: ListFindAllUseCase,
    private readonly createAccountingUseCase: CreateAccountingUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUsecase,
    private readonly updateAccountingUseCase: UpdateAccountingUseCase
  ) {}

  @Post()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(AccountingSchema))
  @HttpCode(HttpStatus.OK)
  async create(@Body() data: TAccountingSchema) {
    await this.createAccountingUseCase.execute(data);
    return { message: "Criado com sucesso" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  findAll(@Query() query: TAccountingSchema) {
    return this.listFindAllUseCase.execute(query);
  }
  @Patch()
  async update(
    @Query("id") id: string,
    @Body() data: Partial<TAccountingSchema>
  ) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException("ID deve ser um número válido");
    }
    return await this.updateAccountingUseCase.execute(numericId, data);
  }

  @Delete()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @HttpCode(HttpStatus.OK)
  async remove(@Query("id") id: number) {
    await this.deleteAccountUseCase.execute(id);
    return { message: "Removido com sucesso" };
  }
}
