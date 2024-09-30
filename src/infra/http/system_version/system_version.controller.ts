import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SystemVersionService } from "./system_version.service";
import { CreateSystemVersionDto } from "./dto/create-system_version.dto";
import { UpdateSystemVersionDto } from "./dto/update-system_version.dto";

@Controller("system-version")
export class SystemVersionController {
  constructor(private readonly systemVersionService: SystemVersionService) {}

  @Post()
  create(@Body() createSystemVersionDto: CreateSystemVersionDto) {
    return this.systemVersionService.create(createSystemVersionDto);
  }

  @Get()
  findAll() {
    return this.systemVersionService.findAll();
  }

  @Get()
  findOne(@Param("id") id: string) {
    return this.systemVersionService.findOne(+id);
  }

  @Patch()
  update(
    @Param("id") id: string,
    @Body() updateSystemVersionDto: UpdateSystemVersionDto
  ) {
    return this.systemVersionService.update(+id, updateSystemVersionDto);
  }

  @Delete()
  remove(@Param("id") id: string) {
    return this.systemVersionService.remove(+id);
  }
}
