import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ErrorInterceptor(),
    new LoggingInterceptor(),
  );

  await app.listen(3000);
}
bootstrap();
