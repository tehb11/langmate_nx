import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Проверка состояния системы' })
  @ApiResponse({
    status: 200,
    description: 'Система работает нормально',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
      },
    },
  })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('ping')
  @ApiOperation({ summary: 'Простая проверка доступности API' })
  @ApiResponse({
    status: 200,
    description: 'API доступен',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  ping() {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }
}
