import { JwtAuthGuard } from "@infra/auth/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/repositories/middleware/decorator.rolues";
import { RolesGuard } from "@infra/repositories/middleware/roles_guard";
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
  SystemVersionSchemaDto,
  TSystemVersionSchemaDto,
  type TPostValid,
} from "./dto/system_version.dtos";
import { SystemVersionService } from "./system_version.service";
import { ZodValidationPipe } from "@infra/repositories/middleware/pipes/zod_validation_pipes";
import { CreateSystemVersionUseCase } from "./usecases/create_system_version.usecases";
import { DeleteSystemVersionUsecase } from "./usecases/delete_system_version.usecases";

@Controller("system-version")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemVersionController {
  constructor(
    private readonly systemVersionService: SystemVersionService,
    private readonly CreateSystemVersionUseCase: CreateSystemVersionUseCase,
    private readonly DeleteSystemVersionUsecase: DeleteSystemVersionUsecase
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
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(SystemVersionSchemaDto))
  create(@Body() createSystemVersionDto: TPostValid) {
    return this.CreateSystemVersionUseCase.execute(createSystemVersionDto);
  }

  @Get()
  findAll() {
    return this.systemVersionService.findAll();
  }

  @Get(":id")
  findOne(@Query("id") id: string) {
    return this.systemVersionService.findOne(+id);
  }

  @Patch()
  update(
    @Query("id") id: string,
    @Body() updateSystemVersionDto: TSystemVersionSchemaDto
  ) {
    return this.systemVersionService.update(+id, updateSystemVersionDto);
  }

  @Delete()
  remove(@Query("id") id: number) {
    return this.DeleteSystemVersionUsecase.execute(id);
  }
}
