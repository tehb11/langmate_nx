import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    deviceInfo?: string
  ): Promise<RefreshToken> {
    this.logger.log(`Creating refresh token for user ${userId}`);
    this.logger.log(`Token: ${token.substring(0, 20)}...`);
    this.logger.log(`ExpiresAt: ${expiresAt}`);

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
      deviceInfo,
    });

    this.logger.log(`Created entity:`, refreshToken);

    const savedToken = await this.refreshTokenRepository.save(refreshToken);
    this.logger.log(`Refresh token saved with ID: ${savedToken.id}`);
    this.logger.log(`Saved token:`, savedToken);

    return savedToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    this.logger.log(`Finding refresh token: ${token.substring(0, 10)}...`);

    const result = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });

    this.logger.log(`Found token: ${result ? 'YES' : 'NO'}`);
    return result;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find({
      where: { userId, isRevoked: false },
      order: { createdAt: 'DESC' },
    });
  }

  async revokeToken(token: string): Promise<void> {
    this.logger.log(`Revoking token: ${token.substring(0, 10)}...`);
    await this.refreshTokenRepository.update({ token }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    this.logger.log(`Revoking all tokens for user: ${userId}`);
    await this.refreshTokenRepository.update({ userId }, { isRevoked: true });
  }

  async revokeTokenById(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { id: tokenId },
      { isRevoked: true }
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
