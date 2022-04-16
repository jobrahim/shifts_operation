import { OperationType } from '../entities/shifts-operation-item.entity';
export class CreateShiftsOperationItemDto {
  id: number;
  type: OperationType;
  booking_item: string;
  appointment_id: string;
  eqboiGkey: string;
  shifts_operation: number;
  container_id: string;
  n4_unit_id: string;
  appointment_date: string;
  appointment_range: string;
  container_iso: string;
  operation_order_id: number;
}
