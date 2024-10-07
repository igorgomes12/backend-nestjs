import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
} from "@nestjs/common";
import { LincesesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import { CreateLicenseUsecase } from "features/licenses/domain/usecases/create.usecase";
import { FindAllLicensesUseCase } from "features/licenses/domain/usecases/find-all.usecase";
import { SystemVersionSchemaDto } from "features/system-version/domain/dto/system_version.dtos";

@Controller("licenses")
@Roles(
  "ADMIN",
  "FINANCE",
  "REPRESENTATIVE",
  "REPRESENTATIVE_SUPERVISOR",
  "SUPPORT_SUPERVISOR",
  "PROGRAMMING_SUPERVISOR"
)
@UsePipes(new ZodValidationPipe(SystemVersionSchemaDto))
@UseGuards(JwtAuthGuard, RolesGuard)
export class LincesesController {
  constructor(
    private readonly lincesesService: LincesesService,
    private readonly findAllLicensesUseCase: FindAllLicensesUseCase,
    private readonly createLicenseUsecase: CreateLicenseUsecase
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createLinceseDto: any) {
    return this.createLicenseUsecase.execute(createLinceseDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.findAllLicensesUseCase.execute();
  }

  @Get()
  findOne(@Param("id") id: string) {
    return this.lincesesService.findOne(+id);
  }

  @Patch()
  update(@Param("id") id: string, @Body() updateLinceseDto: any) {
    return this.lincesesService.update(+id, updateLinceseDto);
  }

  @Delete()
  remove(@Param("id") id: string) {
    return this.lincesesService.remove(+id);
  }
}
