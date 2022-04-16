import { PartialType } from '@nestjs/swagger';
import { CreateShiftsOperationDto } from './create-shifts-operation.dto';

export class UpdateShiftsOperationDto extends PartialType(
  CreateShiftsOperationDto,
) {}
