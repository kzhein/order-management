import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'order_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
