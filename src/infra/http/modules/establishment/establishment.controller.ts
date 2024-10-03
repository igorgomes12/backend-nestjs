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
import {
  schemaEstablished,
  type SchemaEstablished,
} from "./dto/create-establishment.dto";
import { Response } from "express";
import { EstablishmentService } from "@common/domain/service/service_establishment/establishment.service";
import { AllExceptionsFilter } from "core/filters/exception.filter";
import { Establishment } from "@common/domain/entities/entities_establishment/establishment.entity";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";

@Controller("establishment")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

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
  create(@Body() createEstablishmentDto: SchemaEstablished) {
    return this.establishmentService.create(createEstablishmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("status") status?: string,
    @Query("name") name?: string,
    @Query("id") id?: string
  ): Promise<Establishment[]> {
    const statusBoolean = status !== undefined ? status === "true" : undefined;
    const idNumber = id !== undefined ? parseInt(id, 10) : undefined;

    const result = await this.establishmentService.filter({
      status: statusBoolean,
      name,
      id: idNumber,
    });

    return result;
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
    @Body() updateEstablishmentDto: SchemaEstablished
  ) {
    const establishmentId = id;
    if (isNaN(establishmentId)) {
      throw new BadRequestException("Invalid ID");
    }

    return this.establishmentService.update(
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
      await this.establishmentService.remove(id);
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
