import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemVersionDto } from './create-system_version.dto';

export class UpdateSystemVersionDto extends PartialType(CreateSystemVersionDto) {}
