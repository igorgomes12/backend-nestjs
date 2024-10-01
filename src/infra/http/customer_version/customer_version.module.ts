import { Module } from '@nestjs/common';
import { CustomerVersionService } from './customer_version.service';
import { CustomerVersionController } from './customer_version.controller';

@Module({
  controllers: [CustomerVersionController],
  providers: [CustomerVersionService],
})
export class CustomerVersionModule {}
