import { ApiProperty } from '@nestjs/swagger';

export class IndexOperationResponseDto {
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  from: number;
  @ApiProperty()
  to: number;
  @ApiProperty()
  last_page: number;
  @ApiProperty()
  per_page: number;
  @ApiProperty()
  total: number;
  @ApiProperty({ type: () => [IndexFinalResponseDto] })
  data: IndexFinalResponseDto[];
}

export class IndexFinalResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  turno: string;
  @ApiProperty()
  hora: string;
  @ApiProperty()
  booking_id: string;
  @ApiProperty()
  vesselVoyage: string;
  @ApiProperty()
  iso_code: string;
  @ApiProperty()
  appointment_id: string;
  @ApiProperty()
  vessel_visit_plus: string;
  @ApiProperty()
  outCallNumber: string;
  @ApiProperty()
  billofLading: string;
  @ApiProperty()
  status: string;
}
