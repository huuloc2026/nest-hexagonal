import { Logger, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

const redisModuleFactory = CacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');
    const redisConfig = {
      store: redisStore,
      url: configService.getOrThrow('CACHE_URL'),
      ttl: configService.getOrThrow('CACHE_TTL'),
    };

    logger.log(`🔄 Connecting to Redis at ${redisConfig.url}`);

    return redisConfig;
  },
  inject: [ConfigService],
});

@Module({
  imports: [redisModuleFactory],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
