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
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { Response } from "express";
import { createRepresentativeSchemaDto } from "features/representative/domain/dto/create-representative.dto";
import { TRepresentativeSchemaDto } from "features/representative/domain/dto/representative.dto";
import { CreateRepresentativeUseCase } from "features/representative/domain/usecases/create.usecase";
import { DeleteRepresentativeUsecase } from "features/representative/domain/usecases/delete.usecase";
import { FindAllRepresentativesUseCase } from "features/representative/domain/usecases/find-all.usecase";
import { FindRepresentativeByIdUseCase } from "features/representative/domain/usecases/find-by-id.usecase";
import { UpdateRepresentativeUsecase } from "features/representative/domain/usecases/update.usecase";

@Controller("representative")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RepresentativeController {
  constructor(
    private readonly findAllRepresentativesUseCase: FindAllRepresentativesUseCase,
    private readonly createRepresentativeUseCase: CreateRepresentativeUseCase,
    private readonly deleteRepresentativeUsecase: DeleteRepresentativeUsecase,
    private readonly updateRepresentativeUsecase: UpdateRepresentativeUsecase,
    private readonly findRepresentativeByIdUseCase: FindRepresentativeByIdUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  findAll() {
    return this.findAllRepresentativesUseCase.execute();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  async findById(@Param("id") id: number) {
    const representative = await this.findRepresentativeByIdUseCase.execute(id);
    if (!representative) {
      throw new NotFoundException(`Representante com ID ${id} não encontrado`);
    }
    return representative;
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(createRepresentativeSchemaDto))
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  async create(@Body() body: TRepresentativeSchemaDto) {
    return this.createRepresentativeUseCase.execute(body);
  }
  @Patch()
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  update(@Query("id") id: number, @Body() body: TRepresentativeSchemaDto) {
    return this.updateRepresentativeUsecase.execute(id, body);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles("ADMIN", "REPRESENTATIVE", "REPRESENTATIVE_SUPERVISOR")
  async remove(@Res() res: Response, @Query("id") id: number) {
    try {
      await this.deleteRepresentativeUsecase.execute(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `O usuário com ID ${id} foi deletado com sucesso!`,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return res.status(error.getStatus()).json({ error: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Erro ao deletar usuário" });
    }
  }
}
