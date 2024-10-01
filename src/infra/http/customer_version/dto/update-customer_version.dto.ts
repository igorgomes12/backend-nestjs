import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerVersionDto } from './create-customer_version.dto';

export class UpdateCustomerVersionDto extends PartialType(CreateCustomerVersionDto) {}
