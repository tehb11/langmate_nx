import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from './refresh-token.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log('Registering new user');
    const user = await this.usersService.create(registerDto);

    const tokens = await this.generateTokens(user.id, user.email);

    // Сохраняем refresh token в отдельной таблице
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

    await this.refreshTokenService.createRefreshToken(
      user.id,
      tokens.refreshToken,
      expiresAt
    );

    this.logger.log(`User registered successfully: ${user.id}`);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log('User login attempt');
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    // Сохраняем refresh token в отдельной таблице
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

    await this.refreshTokenService.createRefreshToken(
      user.id,
      tokens.refreshToken,
      expiresAt
    );

    this.logger.log(`User logged in successfully: ${user.id}`);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<TokenResponseDto> {
    this.logger.log('Refresh token attempt');
    try {
      // Валидируем refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      this.logger.log(`JWT payload valid for user: ${payload.sub}`);

      // Проверяем токен в БД
      const refreshTokenEntity = await this.refreshTokenService.findByToken(
        refreshTokenDto.refreshToken
      );

      if (!refreshTokenEntity || refreshTokenEntity.isRevoked) {
        this.logger.warn('Invalid or revoked refresh token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Проверяем срок действия
      if (refreshTokenEntity.expiresAt < new Date()) {
        this.logger.warn('Refresh token expired');
        throw new UnauthorizedException('Refresh token expired');
      }

      // Генерируем новые токены
      const tokens = await this.generateTokens(
        refreshTokenEntity.userId,
        payload.email
      );

      // Отзываем старый токен
      await this.refreshTokenService.revokeToken(refreshTokenDto.refreshToken);

      // Создаем новый refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.refreshTokenService.createRefreshToken(
        refreshTokenEntity.userId,
        tokens.refreshToken,
        expiresAt
      );

      this.logger.log('Tokens refreshed successfully');
      return tokens;
    } catch (error) {
      this.logger.error('Refresh token error:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    this.logger.log(`Logout for user: ${userId}`);
    // Отзываем все refresh токены пользователя
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }

  async logoutDevice(token: string): Promise<void> {
    // Отзываем конкретный refresh token
    await this.refreshTokenService.revokeToken(token);
  }

  async getUserSessions(userId: string): Promise<any[]> {
    // Получаем все активные сессии пользователя
    const tokens = await this.refreshTokenService.findByUserId(userId);
    return tokens.map((token) => ({
      id: token.id,
      deviceInfo: token.deviceInfo,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
    }));
  }

  async validateUser(id: string): Promise<any> {
    return this.usersService.findById(id);
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: '15m' } // Access token на 15 минут
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
          expiresIn: '7d', // Refresh token на 7 дней
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
