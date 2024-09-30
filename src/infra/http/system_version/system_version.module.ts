import { Module } from '@nestjs/common';
import { SystemVersionService } from './system_version.service';
import { SystemVersionController } from './system_version.controller';

@Module({
  controllers: [SystemVersionController],
  providers: [SystemVersionService],
})
export class SystemVersionModule {}
