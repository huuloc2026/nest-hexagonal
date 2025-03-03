import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Log the error here
        console.error(error);

        return throwError(
          () =>
            new InternalServerErrorException({
              statusCode: 500,
              message: 'Internal server error',
              error:
                process.env.NODE_ENV === 'development'
                  ? error.message
                  : undefined,
            }),
        );
      }),
    );
  }
}
