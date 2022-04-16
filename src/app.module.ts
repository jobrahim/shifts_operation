import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ShiftsOperationItemEntity } from './shifts-operation-item/entities/shifts-operation-item.entity';
import { ShiftsOperationItemModule } from './shifts-operation-item/shifts-operation-item.module';
import { ShiftsOperationsIntegrationModule } from './shifts-operations-integration/shifts-operations-integration.module';
import { ShiftsOperationModule } from './shifts-operation/shifts-operation.module';
import { ShiftsOperationEntity } from './shifts-operation/entities/shifts-operation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'local'}.env`,
      isGlobal: true,
    }),
    //config typeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('SQL_HOST'),
        port: +config.get('SQL_PORT'),
        username: config.get('SQL_USER'),
        password: config.get('SQL_PASSWORD'),
        database: config.get('SQL_DATABASE'),
        entities: [ShiftsOperationItemEntity, ShiftsOperationEntity],
        synchronize: true,
        options: {
          encrypt: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ShiftsOperationItemModule,
    ShiftsOperationsIntegrationModule,
    ShiftsOperationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
