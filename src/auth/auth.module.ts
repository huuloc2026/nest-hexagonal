import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './interface/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthRepositoryAdapter } from './infrastructure/adapters/auth.repository.adapter';
import { AUTH_REPOSITORY } from './domain/ports/auth.repository.port';
import { UsersModule } from '../module/users/users.module';
import { AtStrategy } from './interface/strategies/at.strategy';
import { RtStrategy } from './interface/strategies/rt.strategy';
import { TokenBlacklistGuard } from './interface/guards/token-blacklist.guard';
import { RtGuard } from './interface/guards/rt.guard';
import { AtGuard } from './interface/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule],
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
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  exports: [TokenBlacklistGuard],
})
export class AuthModule {}
