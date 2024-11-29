import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";

import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import {
  descriptionCalledSchema,
  type TDescriptionCalledSchema,
} from "features/description-called/domain/dto/description-called-dto";
import { Response } from "express";
import { DescriptionCalledService } from "features/description-called/domain/services/description-called.service";
import { CreateDescriptionCalledUseCase } from "features/description-called/domain/usecases/create-description-called";
import { FindAllDescriptionCalledUseCase } from "features/description-called/domain/usecases/find-all-description-called";
import { EditDescriptionCalledUseCase } from "features/description-called/domain/usecases/edit-description-called";
import { DeleteDescriptionCalledUseCase } from "features/description-called/domain/usecases/delete-description-called";

@Controller("descriptionCalled")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class DescriptionCalledController {
  constructor(
    private readonly descriptionCalledService: DescriptionCalledService,
    private readonly findAllDescriptionCalledUseCase: FindAllDescriptionCalledUseCase,
    private readonly createDescriptionCalledUseCase: CreateDescriptionCalledUseCase,
    private readonly editDescriptionCalledUseCase: EditDescriptionCalledUseCase,
    private readonly deleteDescriptionCalledUseCase: DeleteDescriptionCalledUseCase
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
  @UsePipes(new ZodValidationPipe(descriptionCalledSchema))
  @HttpCode(HttpStatus.OK)
  async create(@Res() res: Response, @Body() data: TDescriptionCalledSchema) {
    try {
      await this.createDescriptionCalledUseCase.execute(data);
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
  findAll() {
    return this.findAllDescriptionCalledUseCase.execute();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.descriptionCalledService.findById(+id);
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: any
  ) {
    try {
      await this.editDescriptionCalledUseCase.execute(id, updateData);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Chamado atualizado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao atualizar Chamado");
    }
  }
  @Delete(":id")
  async remove(@Param("id") id: number, @Res() res: Response) {
    try {
      await this.deleteDescriptionCalledUseCase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `O Chamado com ID ${id} foi deletado com sucesso!`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  handleError(res: Response<any, Record<string, any>>, error: unknown) {
    throw new Error("Method not implemented.");
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
