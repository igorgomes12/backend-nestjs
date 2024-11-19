import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  Res,
  UsePipes,
  Put,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { CalledDto, calledSchema } from "features/called/domain/dto/called.dto";
import { DeleteCalledUsecase } from "features/called/domain/usecases/delete.usecase";
import { FindAllCalledUseCase } from "features/called/domain/usecases/find-all.usecase";
import { Response } from "express";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { CreateCalledUseCase } from "features/called/domain/usecases/create.usecase";
import { UpdateCalledUseCase } from "features/called/domain/usecases/update.usecase";
import { FindCalledByIdUseCase } from "features/called/domain/usecases/find-id.usecase";

@Controller("called")
@Roles(
  "ADMIN",
  "FINANCE",
  "REPRESENTATIVE",
  "REPRESENTATIVE_SUPERVISOR",
  "SUPPORT_SUPERVISOR",
  "PROGRAMMING_SUPERVISOR"
)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class CalledController {
  constructor(
    private readonly findAllCalledUseCase: FindAllCalledUseCase,
    private readonly deleteCalledUsecase: DeleteCalledUsecase,
    private readonly createCalledUseCase: CreateCalledUseCase,
    private readonly updateCalledUseCase: UpdateCalledUseCase,
    private readonly findCalledByIdUseCase: FindCalledByIdUseCase
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(calledSchema))
  async create(@Res() res: Response, @Body() data: CalledDto) {
    try {
      await this.createCalledUseCase.execute(data);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: "Chamado criado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao criar chamado");
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response) {
    try {
      const called = await this.findAllCalledUseCase.execute();
      return res.status(HttpStatus.OK).json(called);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar contas");
    }
  }

  @Get(":id")
  async findById(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    try {
      const called = await this.findCalledByIdUseCase.execute(id);
      if (!called) {
        throw new NotFoundException("Chamado não encontrada");
      }
      return res.status(HttpStatus.OK).json(called);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar Chamado");
    }
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: any
  ) {
    try {
      await this.updateCalledUseCase.execute(id, updateData);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Chamado atualizado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao atualizar Chamado");
    }
  }

  @Delete()
  async remove(@Res() res: Response, @Query("id", ParseIntPipe) id: number) {
    try {
      await this.deleteCalledUsecase.execute(id);
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
