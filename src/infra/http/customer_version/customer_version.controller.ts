import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerVersionService } from './customer_version.service';
import { CreateCustomerVersionDto } from './dto/create-customer_version.dto';
import { UpdateCustomerVersionDto } from './dto/update-customer_version.dto';

@Controller('customer-version')
export class CustomerVersionController {
  constructor(private readonly customerVersionService: CustomerVersionService) {}

  @Post()
  create(@Body() createCustomerVersionDto: CreateCustomerVersionDto) {
    return this.customerVersionService.create(createCustomerVersionDto);
  }

  @Get()
  findAll() {
    return this.customerVersionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerVersionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerVersionDto: UpdateCustomerVersionDto) {
    return this.customerVersionService.update(+id, updateCustomerVersionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerVersionService.remove(+id);
  }
}
