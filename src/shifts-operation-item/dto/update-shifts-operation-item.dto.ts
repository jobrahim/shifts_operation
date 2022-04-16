import { PartialType } from '@nestjs/swagger';
import { CreateShiftsOperationItemDto } from './create-shifts-operation-item.dto';

export class UpdateShiftsOperationItemDto extends PartialType(
  CreateShiftsOperationItemDto,
) {}
