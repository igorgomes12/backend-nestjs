import { JwtAuthGuard } from "@infra/http/guards/decorators/jwt_auth.decorator";
import { Roles } from "@infra/http/middleware/decorator.rolues";
import { RolesGuard } from "@infra/http/middleware/roles_guard";
import { ZodValidationPipe } from "@infra/http/pipes/zod_validation_pipes";
import {
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
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { LicensesService } from "features/licenses/data/service/prisma/licenses-prisma.service";
import {
  licensesSchemaDto,
  TLicensesSchemaDto,
} from "features/licenses/domain/dto/licenses.dto";
import { CreateLicenseUsecase } from "features/licenses/domain/usecases/create.usecase";
import { FindAllLicensesUseCase } from "features/licenses/domain/usecases/find-all.usecase";
import { UpdateLicenseUsecase } from "features/licenses/domain/usecases/update.usecase";

@Controller("licenses")
@Roles(
  "ADMIN",
  "FINANCE",
  "REPRESENTATIVE",
  "REPRESENTATIVE_SUPERVISOR",
  "SUPPORT_SUPERVISOR",
  "PROGRAMMING_SUPERVISOR"
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class LicensesController {
  constructor(
    private readonly licensesService: LicensesService,
    private readonly findAllLicensesUseCase: FindAllLicensesUseCase,
    private readonly createLicenseUsecase: CreateLicenseUsecase,
    private readonly updateLicenseUsecase: UpdateLicenseUsecase
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(licensesSchemaDto))
  create(@Body() createLicenseDto: TLicensesSchemaDto) {
    return this.createLicenseUsecase.execute(createLicenseDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.findAllLicensesUseCase.execute();
  }

  @Get()
  findOne(@Param("id") id: number) {
    return this.licensesService.findOne(+id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(
    @Query("id") id: number,
    @Body() updateLicenseDto: TLicensesSchemaDto
  ) {
    const res = await this.updateLicenseUsecase.execute(id, updateLicenseDto);
    if (!res) {
      throw new NotFoundException("Licença não encontrada");
    }
    return res;
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.licensesService.remove(+id);
  }
}
