/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  console.log('=== BOOTSTRAP STARTED ===');
  console.log('SERVER', process.env.PORT, process.env.DB_HOST);

  const app = await NestFactory.create(AppModule);

  // Глобальный префикс для API
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Глобальные фильтры и интерцепторы
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );

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

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('LangMate API')
    .setDescription('API для приложения LangMate')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Аутентификация')
    .addTag('users', 'Пользователи')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();
