import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
      retryAttempts: 3,
      retryDelay: 500,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('ITL Shift Operation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('shifts-operations/api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
