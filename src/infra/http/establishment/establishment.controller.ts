import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/middleware/decorator.rolues";
import { RolesGuard } from "@infra/middleware/roles_guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  BadRequestException,
} from "@nestjs/common";
import { EstablishmentService } from "./establishment.service";
import {
  schemaEstablished,
  type SchemaEstablished,
} from "./dto/create-establishment.dto";
import { ZodValidationPipe } from "@infra/middleware/pipes/zod_validation_pipes";

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
  findAll() {
    return this.establishmentService.findAll();
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
