import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShiftsOperationDto {
  @ApiProperty()
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  created: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  changed: string;
  @ApiProperty()
  @IsString()
  user_id: string;
  @ApiProperty()
  @IsString()
  client_id: string;
  @ApiProperty()
  @IsString()
  client_cuit: string;
  @ApiProperty()
  vesselVisit: string;
}
