import { IsNumberString } from 'class-validator';

export class IndexShiftOperationParamsDto {
  @IsNumberString()
  page: number;
}
