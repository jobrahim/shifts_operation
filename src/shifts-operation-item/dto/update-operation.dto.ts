import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationOrderDto } from './create-operation-order.dto';

export class UpdateOperationDto extends PartialType(CreateOperationOrderDto) {}
