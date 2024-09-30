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
} from "@nestjs/common";
import { TSystemVersionSchemaDto } from "./dto/system_version.dtos";
import { SystemVersionService } from "./system_version.service";

@Controller("system-version")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemVersionController {
  constructor(private readonly systemVersionService: SystemVersionService) {}

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
  create(@Body() createSystemVersionDto: TSystemVersionSchemaDto) {
    return this.systemVersionService.create(createSystemVersionDto);
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
  remove(@Query("id") id: string) {
    return this.systemVersionService.remove(+id);
  }
}
