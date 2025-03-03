import { Module } from '@nestjs/common';
import { UserController } from './interface/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepositoryAdapter } from './infrastructure/adapters/user.repository.adapter';
import { USER_REPOSITORY } from './domain/ports/user.repository.port';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryAdapter,
    },
  ],
})
export class UsersModule {}
