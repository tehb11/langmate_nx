import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные для регистрации',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токенов доступа' })
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный или истекший refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из системы (все устройства)' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход из всех устройств',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully logged out from all devices',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  async logout(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.id);
    return { message: 'Successfully logged out from all devices' };
  }

  @Post('logout-device')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из системы (текущее устройство)' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход с текущего устройства',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully logged out from this device',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  async logoutDevice(
    @Body() body: { refreshToken: string }
  ): Promise<{ message: string }> {
    await this.authService.logoutDevice(body.refreshToken);
    return { message: 'Successfully logged out from this device' };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить активные сессии пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список активных сессий',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          deviceInfo: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный доступ',
  })
  async getUserSessions(@Request() req): Promise<any[]> {
    return this.authService.getUserSessions(req.user.id);
  }
}
