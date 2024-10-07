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
  UseFilters,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  SystemVersionSchemaDto,
  TSystemVersionSchemaDto,
  type TPostValid,
} from "../../../../features/system-version/domain/dto/system_version.dtos";

import { AllExceptionsFilter } from "core/filters/exception.filter";
import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";

import { CreateSystemVersionUseCase } from "features/system-version/domain/usecases/create_system_version.usecases";
import { DeleteSystemVersionUsecase } from "features/system-version/domain/usecases/delete_system_version.usecases";
import { ListSystemVersionUsecase } from "features/system-version/domain/usecases/list_system_version.usecase";
import { UpdateSystemVersionUsecase } from "features/system-version/domain/usecases/update_system_version.usecase";

@Controller("system-version")
@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemVersionController {
  constructor(
    private readonly CreateSystemVersionUseCase: CreateSystemVersionUseCase,
    private readonly DeleteSystemVersionUsecase: DeleteSystemVersionUsecase,
    private readonly UpdateSystemVersionUsecase: UpdateSystemVersionUsecase,
    private readonly ListSystemVersionUsecase: ListSystemVersionUsecase
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
  @Roles(
    "ADMIN",
    "FINANCE",
    "REPRESENTATIVE",
    "REPRESENTATIVE_SUPERVISOR",
    "SUPPORT_SUPERVISOR",
    "PROGRAMMING_SUPERVISOR"
  )
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.ListSystemVersionUsecase.execute();
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
  update(
    @Query("id") id: number,
    @Body() updateSystemVersionDto: TSystemVersionSchemaDto
  ) {
    return this.UpdateSystemVersionUsecase.execute(id, updateSystemVersionDto);
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
    return this.DeleteSystemVersionUsecase.execute(id);
  }
}
