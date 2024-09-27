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
} from "@nestjs/common";
import { TSystemSchemaDto } from "./dto/system.dto";
import { CreateSystemUsecase } from "./usecases/create_system.usecases";
import { DeleteSystemUsecase } from "./usecases/delete_system.usecases";
import { FindAllSystemsUseCase } from "./usecases/system.usecases";
import { UpdateSystemUsecase } from "./usecases/update_system.usecases";

@Controller("systems")
export class SystemsController {
  constructor(
    private readonly findAllSystemsUseCase: FindAllSystemsUseCase,
    private readonly createSystemsUseCase: CreateSystemUsecase,
    private readonly updateSystemsUseCase: UpdateSystemUsecase,
    private readonly deleteSystemsUseCase: DeleteSystemUsecase
  ) {}

  @Post()
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
  @HttpCode(HttpStatus.OK)
  update(@Query("id") id: number, @Body() updateSystemDto: TSystemSchemaDto) {
    return this.updateSystemsUseCase.execute(id, updateSystemDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@Query("id") id: number) {
    return this.deleteSystemsUseCase.execute(id);
  }
}
