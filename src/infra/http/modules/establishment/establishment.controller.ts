import { Roles } from "@infra/http/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
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
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";

import { AllExceptionsFilter } from "core/filters/exception.filter";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { FindAllEstablishmentUseCase } from "features/establishment/domain/usecases/find-all-establishment.usecase";
import {
  schemaEstablished,
  TSchemaEstablished,
} from "features/establishment/domain/dto/create-establishment.dto";
import { EstablishmentEntity } from "features/establishment/domain/entity/establishment.entity";
import { CreateEstablishmentUsecase } from "features/establishment/domain/usecases/create-establishment.usecase";
import { DeleteEstablishmentUsecase } from "features/establishment/domain/usecases/delete-establishment.usecase";
import { UpdateEstablishmentUsecase } from "features/establishment/domain/usecases/update-establishment.usecase";

@Controller("establishment")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class EstablishmentController {
  constructor(
    private readonly findAllEstablishmentUseCase: FindAllEstablishmentUseCase,
    private readonly createEstablishmentUsecase: CreateEstablishmentUsecase,
    private readonly deleteEstablishmentUsecase: DeleteEstablishmentUsecase,
    private readonly updateEstablishmentUsecase: UpdateEstablishmentUsecase
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
  @UsePipes(new ZodValidationPipe(schemaEstablished))
  @HttpCode(HttpStatus.OK)
  async create(@Body() createEstablishmentDto: TSchemaEstablished) {
    return await this.createEstablishmentUsecase.execute(
      createEstablishmentDto
    );
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: Partial<TSchemaEstablished>
  ): Promise<EstablishmentEntity[]> {
    return await this.findAllEstablishmentUseCase.execute(query);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  update(
    @Query("id") id: number,
    @Body() updateEstablishmentDto: TSchemaEstablished
  ) {
    const establishmentId = id;
    if (isNaN(establishmentId)) {
      throw new BadRequestException("Invalid ID");
    }

    return this.updateEstablishmentUsecase.execute(
      establishmentId,
      updateEstablishmentDto
    );
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
  async remove(@Query("id") id: number, @Res() res: Response) {
    try {
      await this.deleteEstablishmentUsecase.execute(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: "Removido com sucesso" });
    } catch (error) {
      if (error === "P2025") {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `O estabelecimento com ID ${id} já foi excluído.`,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao excluir o estabelecimento com ID ${id}.`,
      });
    }
  }
}
