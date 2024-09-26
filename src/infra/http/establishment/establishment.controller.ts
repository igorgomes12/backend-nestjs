import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/middleware/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/middleware/roles_guard";
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
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  schemaEstablished,
  type SchemaEstablished,
} from "./dto/create-establishment.dto";
import { EstablishmentService } from "./establishment.service";
import type { Establishment } from "./entities/establishment.entity";

@Controller("establishment")
@UseGuards(JwtAuthGuard, RolesGuard)
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
    const establishmentId = Number(id);
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
  async remove(@Query("id") id: number) {
    await this.establishmentService.remove(id);
    return { message: "Removido com sucesso" };
  }
}
