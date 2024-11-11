import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Delete,
  UseFilters,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ParseIntPipe,
  Res,
  NotFoundException,
  BadRequestException,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import {
  accountSchema,
  type TAccounts,
} from "features/account/domain/dto/account.dto";
import { CreateAccountUsecase } from "features/account/domain/usecases/create.usecase";
import { DeleteAccountUseCase } from "features/account/domain/usecases/delete.usecase";
import { FindAllAccountUseCase } from "features/account/domain/usecases/find-all.usecase";
import { UpdateAccountUseCase } from "features/account/domain/usecases/update.usecase";
import { FindAccountByIdUseCase } from "features/account/domain/usecases/find-id.usecase";

@Controller("account")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class AccountController {
  constructor(
    private readonly findAllAccountUseCase: FindAllAccountUseCase,
    private readonly createAccountUsecase: CreateAccountUsecase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly findAccountByIdUseCase: FindAccountByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @UsePipes(new ZodValidationPipe(accountSchema))
  async create(@Res() res: Response, @Body() createAccountDto: TAccounts) {
    try {
      await this.createAccountUsecase.execute(createAccountDto);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: "Conta criada com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao criar conta");
    }
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
  async findAll(@Res() res: Response, @Query() query: TAccounts) {
    try {
      const accounts = await this.findAllAccountUseCase.execute(query);
      return res.status(HttpStatus.OK).json(accounts);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar contas");
    }
  }
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  async findById(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    try {
      const account = await this.findAccountByIdUseCase.execute(id);
      if (!account) {
        throw new NotFoundException("Conta não encontrada");
      }
      return res.status(HttpStatus.OK).json(account);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar conta");
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  async update(
    @Res() res: Response,
    @Query("id", ParseIntPipe) id: number,
    @Body() updateData: TAccounts
  ) {
    try {
      await this.updateAccountUseCase.execute(id, updateData);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Conta atualizada com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao atualizar conta");
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  async remove(@Res() res: Response, @Query("id", ParseIntPipe) id: number) {
    try {
      await this.deleteAccountUseCase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Conta deletada com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao deletar conta");
    }
  }

  private handleException(
    res: Response,
    error: unknown,
    defaultMessage: string
  ) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      return res.status(error.getStatus()).json({ error: error.message });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: defaultMessage,
    });
  }
}
