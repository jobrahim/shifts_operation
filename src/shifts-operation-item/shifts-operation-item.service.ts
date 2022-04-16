import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftsOperationEntity } from 'src/shifts-operation/entities/shifts-operation.entity';
import { Repository } from 'typeorm';
import { CreateShiftsOperationItemDto } from './dto/create-shifts-operation-item.dto';
import { UpdateShiftsOperationItemDto } from './dto/update-shifts-operation-item.dto';
import { ShiftsOperationItemEntity } from './entities/shifts-operation-item.entity';

@Injectable()
export class ShiftsOperationItemService {
  constructor(
    @Inject('APPOINTMENTS_SERVICE')
    private readonly appointmentsService: ClientProxy,

    @Inject('RESOURCE_SERVICE')
    private readonly resourceService: ClientProxy,

    @InjectRepository(ShiftsOperationEntity)
    private readonly shiftsOpRepository: Repository<ShiftsOperationEntity>,

    @Inject('TIMERANGE_SERVICE')
    private readonly timerangesService: ClientProxy,

    @InjectRepository(ShiftsOperationItemEntity)
    private readonly shiftsOperationItemRepository: Repository<ShiftsOperationItemEntity>,
  ) {}

  async create(createOperationItemDto: CreateShiftsOperationItemDto) {
    const newItem = new ShiftsOperationItemEntity();

    const operation = await this.shiftsOpRepository.findOne(
      createOperationItemDto.shifts_operation,
    );

    newItem.shifts_operation = operation;
    newItem.type = createOperationItemDto.type;
    newItem.container_id = createOperationItemDto.container_id;
    newItem.booking_item = createOperationItemDto.booking_item;
    newItem.appointment_id = createOperationItemDto.appointment_id;
    newItem.eqboiGkey = createOperationItemDto.eqboiGkey;
    newItem.id = createOperationItemDto.id;
    newItem.appointment_date = createOperationItemDto.appointment_date;
    newItem.appointment_range = createOperationItemDto.appointment_range;
    newItem.container_iso = createOperationItemDto.container_iso;

    return await this.shiftsOperationItemRepository.save(newItem);
  }

  findOne(id: number): Promise<ShiftsOperationItemEntity> {
    return this.shiftsOperationItemRepository.findOne(id);
  }

  findByOperation(id: number): Promise<ShiftsOperationItemEntity[]> {
    return this.shiftsOperationItemRepository
      .createQueryBuilder('shifts_operation_item')
      .where('shifts_operation_item.shifts_operation_id = :id', { id })
      .getMany();
  }

  async update(id: number, operationItem: UpdateShiftsOperationItemDto) {
    const item = await this.shiftsOperationItemRepository.findOne(id);
    item.operation_order_id = operationItem.operation_order_id;

    return await this.shiftsOperationItemRepository.save(item);
  }
}
