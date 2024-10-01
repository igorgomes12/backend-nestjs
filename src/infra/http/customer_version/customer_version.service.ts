import { Injectable } from '@nestjs/common';
import { CreateCustomerVersionDto } from './dto/create-customer_version.dto';
import { UpdateCustomerVersionDto } from './dto/update-customer_version.dto';

@Injectable()
export class CustomerVersionService {
  create(createCustomerVersionDto: CreateCustomerVersionDto) {
    return 'This action adds a new customerVersion';
  }

  findAll() {
    return `This action returns all customerVersion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerVersion`;
  }

  update(id: number, updateCustomerVersionDto: UpdateCustomerVersionDto) {
    return `This action updates a #${id} customerVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerVersion`;
  }
}
