import { ApiProperty } from '@nestjs/swagger';

export class DetailShiftResponseDto {
  constructor({ id, created }) {
    this.id = id;
    this.created = created;
    this.status = 'STATUS';
    this.booking_id = '';
    this.booking_status = 'booking_status';
    this.itemsDetails = [];
  }

  @ApiProperty()
  id: string;
  @ApiProperty()
  created: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  booking_id: string;
  @ApiProperty()
  booking_status: string;
  @ApiProperty({ type: () => [DetailShiftItemResponseDto] })
  itemsDetails: DetailShiftItemResponseDto[];
}
export class DetailShiftItemResponseDto {
  @ApiProperty()
  booking_line: string;
  @ApiProperty()
  booking_item: string;
  @ApiProperty()
  container_id: string;
  @ApiProperty()
  container_iso: string;
  @ApiProperty()
  appointment_id: string;
  @ApiProperty()
  appointment_date: string;
  @ApiProperty()
  appointment_range: string;
  @ApiProperty()
  appointment_status: string;
  // @ApiProperty()
  // n4_unit_id: string;
  @ApiProperty()
  n4UnitId: number;
  @ApiProperty()
  n4_unit_id: string;
  @ApiProperty()
  n4_ufv_gkey: number;
  @ApiProperty()
  weight: string;
  @ApiProperty()
  seal_customs: string;
  @ApiProperty()
  seal_agency: string;
  @ApiProperty()
  seal_others: string;
  @ApiProperty()
  docs_customs: string;
}
