import { Module } from '@nestjs/common';
import { ShiftsOperationsIntegrationService } from './shifts-operations-integration.service';
import { ShiftsOperationsIntegrationController } from './shifts-operations-integration.controller';
import { ShiftsOperationItemModule } from 'src/shifts-operation-item/shifts-operation-item.module';

@Module({
  imports: [ShiftsOperationItemModule],
  providers: [ShiftsOperationsIntegrationService],
  controllers: [ShiftsOperationsIntegrationController],
})
export class ShiftsOperationsIntegrationModule {}
