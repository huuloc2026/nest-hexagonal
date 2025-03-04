import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './shared/redis/redis.module';
import { ProductsModule } from 'src/module/products/products.module';
import { UsersModule } from 'src/module/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CartsModule } from 'src/module/carts/carts.module';
import { AtStrategy } from 'src/auth/interface/strategies/at.strategy';
import { RtStrategy } from 'src/auth/interface/strategies/rt.strategy';
import { TokenBlacklistGuard } from 'src/auth/interface/guards/token-blacklist.guard';
import { RtGuard } from 'src/auth/interface/guards/rt.guard';
import { AtGuard } from 'src/auth/interface/guards/at.guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    PrismaModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    CartsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
