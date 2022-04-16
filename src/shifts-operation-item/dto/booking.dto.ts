import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class appointmentDto {
  @ApiProperty()
  @IsNumber()
  eqboiGkey: number;
  @ApiProperty()
  @IsBoolean()
  lateArrival: boolean;
  @ApiProperty()
  @IsString()
  apponitmentDate: string;
  @ApiProperty()
  @IsString()
  appointmentTimeFrom: string;
  @ApiProperty()
  @IsString()
  appointmentTimeTo: string;
  @ApiProperty()
  @IsNumber()
  appointmentQuantity: number;
  @ApiProperty()
  @IsString()
  unitNumber: string;
  @ApiProperty()
  @IsString()
  seal1: string;
  @ApiProperty()
  @IsString()
  seal2: string;
  @ApiProperty()
  @IsString()
  seal3: string;
  @ApiProperty()
  @IsString()
  seal4: string;
  @ApiProperty()
  @IsNumber()
  tons: number;
  @ApiProperty()
  @IsBoolean()
  oog: boolean;
  @ApiProperty()
  @IsNumber()
  oogBackCm: number;
  @ApiProperty()
  @IsNumber()
  oogFrontCm: number;
  @ApiProperty()
  @IsNumber()
  oogRightCm: number;
  @ApiProperty()
  @IsNumber()
  oogLeftCm: number;
  @ApiProperty()
  @IsNumber()
  oogTopCm: number;
  @ApiProperty()
  @IsNumber()
  tareWtkg: number;
  @ApiProperty()
  @IsArray()
  customsDocuments: [string];
  @ApiProperty()
  @IsBoolean()
  vgmExo: boolean;
  @ApiProperty()
  @IsBoolean()
  twoCnt20InTruck: boolean;
  @ApiProperty()
  @IsString()
  line: string;
  @ApiProperty()
  @IsString()
  isoType: string;
  @ApiProperty()
  @IsString()
  category: string;
  @ApiProperty()
  @IsString()
  status: string;
}

export class ItemDto {
  @ApiProperty()
  @IsString()
  bookingNumber: string;
  @ApiProperty()
  @IsString()
  commodityDesc: string;
  @ApiProperty()
  @IsString()
  eqboiGkey: string;
  @ApiProperty({ type: () => [appointmentDto] })
  @Type(() => appointmentDto)
  @ValidateNested({ each: true })
  @IsArray()
  appointmentList: [appointmentDto];
}
export class consigneeDto {
  @ApiProperty()
  @IsString()
  cuit: string;
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsString()
  name: string;
}

export class BookingwDto {
  @ApiProperty()
  @IsString()
  number: string;
  @ApiProperty()
  @IsBoolean()
  ableTochangeCustomer: boolean;
  @ApiProperty({ type: () => consigneeDto })
  @Type(() => consigneeDto)
  @ValidateNested({ each: true })
  @IsObject()
  consignee: consigneeDto;
  @ApiProperty()
  @IsBoolean()
  ctvpChecked: boolean;
  @ApiProperty()
  @IsString()
  eqboGkey: string;
  @ApiProperty()
  @IsBoolean()
  hazardous: boolean;
  @ApiProperty({ type: () => ItemDto })
  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @IsObject()
  itemList: ItemDto;
}

export class WrapperDto {
  @ApiProperty({ type: () => BookingwDto })
  @Type(() => BookingwDto)
  @ValidateNested({ each: true })
  @IsObject()
  Booking: BookingwDto;
}

export class BookingDto {
  @ApiProperty({ type: () => WrapperDto })
  @Type(() => WrapperDto)
  @ValidateNested({ each: true })
  @IsObject()
  listWrapper: WrapperDto;
}
