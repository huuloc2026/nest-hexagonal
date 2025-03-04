import { Global, Module } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [ConfigModule, JwtModule.register({}), RedisModule, AuthModule],
  providers: [CryptoService],
  exports: [CryptoService, JwtModule, RedisModule, AuthModule],
})
export class SharedModule {}
