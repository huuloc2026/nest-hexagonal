import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './interface/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthRepositoryAdapter } from './infrastructure/adapters/auth.repository.adapter';
import { AUTH_REPOSITORY } from './domain/ports/auth.repository.port';
import { UsersModule } from 'src/module/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { AtStrategy } from './interface/strategies/at.strategy';
import { RtStrategy } from './interface/strategies/rt.strategy';
import { TokenBlacklistGuard } from './interface/guards/token-blacklist.guard';
import { RedisModule } from '../shared/redis/redis.module';
import { RtGuard } from './interface/guards/rt.guard';

@Module({
  imports: [JwtModule.register({}), UsersModule, SharedModule, RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepositoryAdapter,
    },
    AtStrategy,
    RtStrategy,
    TokenBlacklistGuard,
    RtGuard,
  ],
  exports: [TokenBlacklistGuard],
})
export class AuthModule {}
