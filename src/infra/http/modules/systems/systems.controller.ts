import { Roles } from "@infra/http/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import {
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
  systemSchemaDto,
  TSystemSchemaDto,
} from "../../../../features/systems/domain/dto/system.dto";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { CreateSystemUsecase } from "features/systems/domain/usecases/create_system.usecases";
import { DeleteSystemUsecase } from "features/systems/domain/usecases/delete_system.usecases";
import { FindAllSystemsUseCase } from "features/systems/domain/usecases/system.usecases";
import { UpdateSystemUsecase } from "features/systems/domain/usecases/update_system.usecases";

@Controller("systems")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemsController {
  constructor(
    private readonly findAllSystemsUseCase: FindAllSystemsUseCase,
    private readonly createSystemsUseCase: CreateSystemUsecase,
    private readonly updateSystemsUseCase: UpdateSystemUsecase,
    private readonly deleteSystemsUseCase: DeleteSystemUsecase
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
  @UsePipes(new ZodValidationPipe(systemSchemaDto))
  @HttpCode(HttpStatus.OK)
  create(@Body() createSystemDto: TSystemSchemaDto) {
    return this.createSystemsUseCase.execute(createSystemDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.findAllSystemsUseCase.execute();
  }
  @Patch()
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @HttpCode(HttpStatus.OK)
  update(@Query("id") id: number, @Body() updateSystemDto: TSystemSchemaDto) {
    return this.updateSystemsUseCase.execute(id, updateSystemDto);
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
  remove(@Query("id") id: number) {
    return this.deleteSystemsUseCase.execute(id);
  }
}
