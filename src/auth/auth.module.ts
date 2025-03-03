import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './interface/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { AuthRepositoryAdapter } from './infrastructure/adapters/auth.repository.adapter';
import { AUTH_REPOSITORY } from './domain/ports/auth.repository.port';
import { UsersModule } from '../users/users.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, SharedModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepositoryAdapter,
    },
  ],
})
export class AuthModule {}
