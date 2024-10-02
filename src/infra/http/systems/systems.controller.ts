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
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { systemSchemaDto, TSystemSchemaDto } from "./dto/system.dto";
import { CreateSystemUsecase } from "../../../common/domain/usecases/usecases_system/create_system.usecases";
import { DeleteSystemUsecase } from "../../../common/domain/usecases/usecases_system/delete_system.usecases";
import { FindAllSystemsUseCase } from "../../../common/domain/usecases/usecases_system/system.usecases";
import { UpdateSystemUsecase } from "../../../common/domain/usecases/usecases_system/update_system.usecases";
import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";

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
