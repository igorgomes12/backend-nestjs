import type { AccoutingService } from "@infra/http/accouting/accouting.service";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

@Controller("accouting")
export class AccoutingController {
  constructor(private readonly accoutingService: AccoutingService) {}

  @Post()
  create(@Body() createAccoutingDto: any) {
    return this.accoutingService.create(createAccoutingDto);
  }

  @Get()
  findAll() {
    return this.accoutingService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAccoutingDto: any) {
    return this.accoutingService.update(+id, updateAccoutingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accoutingService.remove(+id);
  }
}
