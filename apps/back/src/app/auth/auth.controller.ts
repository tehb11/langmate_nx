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
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.id);
    return { message: 'Successfully logged out from all devices' };
  }

  @Post('logout-device')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutDevice(
    @Body() body: { refreshToken: string }
  ): Promise<{ message: string }> {
    await this.authService.logoutDevice(body.refreshToken);
    return { message: 'Successfully logged out from this device' };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getUserSessions(@Request() req): Promise<any[]> {
    return this.authService.getUserSessions(req.user.id);
  }
}
