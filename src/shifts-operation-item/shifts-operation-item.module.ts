import { forwardRef, Module } from '@nestjs/common';
import { ShiftsOperationItemService } from './shifts-operation-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { ShiftsOperationItemEntity } from './entities/shifts-operation-item.entity';
import { ShiftsOperationModule } from 'src/shifts-operation/shifts-operation.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule,
    forwardRef(() => ShiftsOperationModule),
    TypeOrmModule.forFeature([ShiftsOperationItemEntity]),
  ],
  controllers: [],
  providers: [
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
  ],
  exports: [TypeOrmModule, ShiftsOperationItemService],
})
export class ShiftsOperationItemModule {}
