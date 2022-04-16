import { forwardRef, Module } from '@nestjs/common';
import { ShiftsOperationService } from './shifts-operation.service';
import { ShiftsOperationController } from './shifts-operation.controller';
import { ShiftsOperationEntity } from './entities/shifts-operation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsOperationItemEntity } from 'src/shifts-operation-item/entities/shifts-operation-item.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShiftsOperationItemService } from 'src/shifts-operation-item/shifts-operation-item.service';
import { AuthModule } from 'src/auth/auth.module';
import { ShiftsOperationItemModule } from 'src/shifts-operation-item/shifts-operation-item.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    forwardRef(() => ShiftsOperationItemModule),
    TypeOrmModule.forFeature([
      ShiftsOperationEntity,
      ShiftsOperationItemEntity,
    ]),
  ],
  controllers: [ShiftsOperationController],
  providers: [
    ShiftsOperationService,
    ShiftsOperationItemService,
    {
      provide: 'APPOINTMENTS_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('APPOINTMENTS_TCP_HOST'),
            port: configService.get('APPOINTMENTS_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'RESOURCE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('RESOURCE_TCP_HOST'),
            port: configService.get('RESOURCE_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'TIMERANGE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('TIMERANGES_TCP_HOST'),
            port: configService.get('TIMERANGES_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'SHIFTS_CONTAINER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SHIFTS_CONTAINER_TCP_HOST'),
            port: configService.get('SHIFTS_CONTAINER_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'SHIFTS_BOOKING_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SHIFTS_BOOKING_TCP_HOST'),
            port: configService.get('SHIFTS_BOOKING_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'OPERATION_ORDER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('OPERATION_ORDER_TCP_HOST'),
            port: configService.get('OPERATION_ORDER_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'PROFILE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('PROFILE_TCP_HOST'),
            port: configService.get('PROFILE_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TypeOrmModule],
})
export class ShiftsOperationModule {}
