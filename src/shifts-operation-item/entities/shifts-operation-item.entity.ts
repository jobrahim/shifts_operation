import { ShiftsOperationEntity } from 'src/shifts-operation/entities/shifts-operation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ShiftsOperationItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OperationType;

  @Column({ nullable: true })
  container_id: string;

  @Column()
  booking_item: string;

  @Column({ nullable: true })
  appointment_id: string;

  @Column()
  eqboiGkey: string;

  @Column()
  appointment_date: string;

  @Column()
  appointment_range: string;

  @Column()
  container_iso: string;

  @ManyToOne(
    () => ShiftsOperationEntity,
    (shiftsOperationEntity) => shiftsOperationEntity.id,
  )
  @JoinColumn({ name: 'shifts_operation_id' })
  shifts_operation: ShiftsOperationEntity;

  @Column({ nullable: true })
  operation_order_id: number;
}

export enum OperationType {
  IMPO = 'IMPO',
  EXPO = 'EXPO',
  EMPTY = 'EMPTY',
}
