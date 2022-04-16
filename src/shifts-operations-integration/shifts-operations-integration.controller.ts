import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ShiftsOperationsIntegrationService } from './shifts-operations-integration.service';

@Controller('shifts-operations-integration')
export class ShiftsOperationsIntegrationController {
  constructor(
    private readonly shiftsOperationsIntegrationService: ShiftsOperationsIntegrationService,
  ) {}

  /**
   *   Update Operations container_id
   *   Params CreateShiftsOperationDto
   */
  @MessagePattern({ cmd: 'update-shift-op' })
  UpdateShiftsOperation(updateShiftsOperationContainer: any) {
    console.log('Mensaje Recibido en update-shift-op: ');
    console.log({ updateShiftsOperationContainer });
    return this.shiftsOperationsIntegrationService.update(
      updateShiftsOperationContainer,
    );
  }

  @MessagePattern({ cmd: 'get-coordination-item' })
  getItem(item_id: any) {
    return this.shiftsOperationsIntegrationService.getItem(item_id);
  }
}
