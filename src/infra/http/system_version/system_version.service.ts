import { Injectable } from '@nestjs/common';
import { CreateSystemVersionDto } from './dto/create-system_version.dto';
import { UpdateSystemVersionDto } from './dto/update-system_version.dto';

@Injectable()
export class SystemVersionService {
  create(createSystemVersionDto: CreateSystemVersionDto) {
    return 'This action adds a new systemVersion';
  }

  findAll() {
    return `This action returns all systemVersion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemVersion`;
  }

  update(id: number, updateSystemVersionDto: UpdateSystemVersionDto) {
    return `This action updates a #${id} systemVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemVersion`;
  }
}
