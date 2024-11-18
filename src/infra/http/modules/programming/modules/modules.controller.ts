import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { CreateModuleEntity } from "features/programming/module/domain/entity/create.entity";
import { CreateModuleUseCase } from "features/programming/module/domain/use-cases/create.usecase";
import { DeleteModuleUsecase } from "features/programming/module/domain/use-cases/delete.usecase";
import { FindAllModulesUseCase } from "features/programming/module/domain/use-cases/find-all.usecase";
import { FindModuleByIdUseCase } from "features/programming/module/domain/use-cases/find-id.usecase";
import { UpdateModuleUsecase } from "features/programming/module/domain/use-cases/update.usecase";

import { Response } from "express";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
  ModuleSchemaDto,
  TModuleSchemaDto,
} from "features/programming/module/domain/dto/module.dto";

@Controller("modules")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(
    private readonly findAllModulesUseCase: FindAllModulesUseCase,
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly deleteModuleUsecase: DeleteModuleUsecase,
    private readonly updateModuleUsecase: UpdateModuleUsecase,
    private readonly findModuleByIdUseCase: FindModuleByIdUseCase
  ) {}
  private readonly logger = new Logger(ModulesController.name);

  @Get()
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<CreateModuleEntity[]> {
    return this.findAllModulesUseCase.execute();
  }

  @Get(":id")
  async findById(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    try {
      const module = await this.findModuleByIdUseCase.execute(id);
      if (!module) {
        throw new NotFoundException("Módulo não encontrado");
      }
      return res.status(HttpStatus.OK).json(module);
    } catch (error) {
      return this.handleException(res, error, "Erro ao buscar módulo");
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  // @UsePipes(new ZodValidationPipe(ModuleSchemaDto))
  async create(@Res() res: Response, @Body() body: TModuleSchemaDto) {
    try {
      this.logger.log("Iniciando criação do módulo:", body);
      await this.createModuleUseCase.execute(body);
      this.logger.log("Módulo criado com sucesso:", body);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Módulo criado com sucesso",
      });
    } catch (error) {
      this.logger.error("Erro ao criar módulo:", error);
      return this.handleException(res, error, "Erro ao criar módulo");
    }
  }

  @Put(":id")
  async update(
    @Res() res: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: TModuleSchemaDto
  ) {
    try {
      await this.updateModuleUsecase.execute(updateData);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Módulo atualizado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao atualizar módulo");
    }
  }

  @Delete()
  async remove(@Res() res: Response, @Query("id", ParseIntPipe) id: number) {
    try {
      await this.deleteModuleUsecase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Módulo deletado com sucesso",
      });
    } catch (error) {
      return this.handleException(res, error, "Erro ao deletar módulo");
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
