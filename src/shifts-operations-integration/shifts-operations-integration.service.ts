import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { ShiftsOperationItemEntity } from 'src/shifts-operation-item/entities/shifts-operation-item.entity';

@Injectable()
export class ShiftsOperationsIntegrationService {
  constructor(
    @InjectRepository(ShiftsOperationItemEntity)
    private readonly turnoRepository: Repository<ShiftsOperationItemEntity>,
  ) {}

  /**
   *   Update Operations
   *   Params CreateShiftsOperationDto
   */
  async update(updateShiftsOperationContainer: any) {
    console.log(updateShiftsOperationContainer.id);

    const shOperations = await getConnection()
      .getRepository(ShiftsOperationItemEntity)
      .createQueryBuilder('shiftsOperationItem')
      .where('shiftsOperationItem.appointment_id = :appointment_id', {
        appointment_id: updateShiftsOperationContainer.id,
      })
      .getOne();

    shOperations.container_id = updateShiftsOperationContainer.container_id;
    const op = this.turnoRepository.save(shOperations);
    return op;
  }

  async getItem(item_id: any) {
    const queryItem =
      'select * from shifts_operation_item_entity where id = ' + item_id;
    const operationItem = await this.turnoRepository.query(queryItem);
    console.log('operationItem: ', operationItem);
    return operationItem;
  }
}
