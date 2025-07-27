/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
  console.log('=== BOOTSTRAP STARTED ===');
  console.log('SERVER', process.env.PORT, process.env.DB_HOST);

  const app = await NestFactory.create(AppModule);

  // Глобальный префикс для API
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS для разработки
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // console.log('SERVER', process.env.PORT, process.env.DB_HOST);
  // process.exit(0);
  console.log('SERVER', process.env.PORT, process.env.DB_HOST);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
