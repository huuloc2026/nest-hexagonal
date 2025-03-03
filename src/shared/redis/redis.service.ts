import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    await this.checkRedisConnection();
  }

  /**
   * Check Redis connection status
   */
  async checkRedisConnection(): Promise<void> {
    try {
      const redisClient = (this.cacheManager as any).store.getClient();
      await redisClient.ping(); // Redis PING command
      this.logger.log('✅ Redis connection is healthy.');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Redis', error);
      throw new InternalServerErrorException('Failed to connect to Redis');
    }
  }

  private getBlacklistKey(token: string): string {
    return `blacklist:${token}`;
  }

  private getUserTokensKey(userId: string): string {
    return `user:${userId}:tokens`;
  }

  async addToBlacklist(
    token: string,
    userId: string,
    ttl = 3600,
  ): Promise<void> {
    const key = this.getBlacklistKey(token);
    this.logger.log(`Adding token to blacklist: ${token.slice(0, 10)}...`);
    await this.cacheManager.set(key, userId, ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = this.getBlacklistKey(token);
    const value = await this.cacheManager.get(key);
    this.logger.log(`Blacklist check for ${token.slice(0, 10)}...: ${!!value}`);
    return !!value;
  }

  async storeUserTokens(userId: string, tokens: TokenPair): Promise<void> {
    const key = this.getUserTokensKey(userId);
    this.logger.log(`Storing tokens for user ${userId}`);
    await this.cacheManager.set(key, tokens, 7 * 24 * 60 * 60);
  }

  async getUserTokens(userId: string): Promise<TokenPair | null> {
    const key = this.getUserTokensKey(userId);
    const tokens = await this.cacheManager.get<TokenPair>(key);
    this.logger.log(`Retrieved tokens for user ${userId}: ${!!tokens}`);
    return tokens || null;
  }

  async revokeUserTokens(userId: string): Promise<void> {
    const key = this.getUserTokensKey(userId);
    await this.cacheManager.del(key);
  }
}
