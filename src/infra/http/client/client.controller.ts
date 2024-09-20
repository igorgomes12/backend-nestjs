import { JwtAuthGuard } from '@infra/auth/guards/decorators/jwt_auth.decorator';
import { Roles } from '@infra/middleware/decorator.rolues';
import { RolesGuard } from '@infra/middleware/roles_guard';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', "PROGRAMMING")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.clientService.remove(+id);
  }
}
