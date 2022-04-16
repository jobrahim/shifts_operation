import { ApiProperty } from '@nestjs/swagger';

export class MultipleCreateResponseDto {
  @ApiProperty()
  operation_id: number; // id of the operation
  @ApiProperty()
  quantity: number; // cantidadde operaciones creadas
  @ApiProperty({ type: () => [ContainerMultipleDto] })
  containers: [ContainerMultipleDto];
}
export class ContainerMultipleDto {
  @ApiProperty()
  success: boolean; //true si creo la operacion
  @ApiProperty()
  appointment_id: number; // ID item de operation
  @ApiProperty()
  operation_item_id: number; // ID item de operation
  @ApiProperty()
  container_id: string; //container type
  @ApiProperty()
  n4_unit_id: string;
}
