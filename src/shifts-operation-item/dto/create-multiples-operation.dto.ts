import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OperationType } from '../entities/shifts-operation-item.entity';
import { IsNumberString } from 'class-validator';

export class CreateMultiplesOperationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;
  @ApiProperty()
  @IsString()
  client_id: string;
  @ApiProperty()
  @IsString()
  client_cuit: string;
  @ApiProperty()
  @IsString()
  client_name: string;
  @ApiProperty()
  @IsString()
  status: string;
  @ApiProperty({ type: () => [ContainersOperationDto] })
  @Type(() => ContainersOperationDto)
  @ValidateNested({ each: true })
  containers: [ContainersOperationDto];
}

export class ContainersOperationDto {
  @ApiProperty()
  @IsString()
  type: OperationType;
  @ApiProperty()
  @IsString()
  booking_item: string;
  @ApiProperty()
  @IsNumber()
  appointment_id: number;
  @ApiProperty()
  eqboiGkey: string;
  @ApiProperty()
  appointment_date: string;
  @ApiProperty()
  @IsString()
  n4_unit_id: string;
  @ApiProperty()
  @IsNumber()
  n4_ufv_gkey: number;
  @ApiProperty()
  @IsNumberString()
  weight: string;
  @ApiProperty()
  @IsString()
  seal_customs: string;
  @ApiProperty()
  @IsString()
  seal_agency: string;
  @ApiProperty()
  @IsString()
  seal_others: string;
  @ApiProperty()
  @IsString()
  docs_customs: string;
}
