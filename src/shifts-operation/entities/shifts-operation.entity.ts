import { ShiftsOperationItemEntity } from 'src/shifts-operation-item/entities/shifts-operation-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShiftsOperationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  created: string;

  @Column({ nullable: true })
  changed: string;

  @Column()
  user_id: string;

  @Column()
  client_id: string;

  @Column()
  client_cuit: string;

  @Column()
  client_name: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  vesselVisit: string;

  @OneToMany(
    () => ShiftsOperationItemEntity,
    (shiftsOperationItemEntity) => shiftsOperationItemEntity.shifts_operation,
  )
  shifts_operation_item: ShiftsOperationItemEntity[];
}
