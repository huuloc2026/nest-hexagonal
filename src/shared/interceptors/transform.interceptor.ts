import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const responseData: Response<T> = {
          statusCode: response.statusCode,
          data: data?.data || data,
          message: data?.message,
        };

        // Handle paginated responses
        if (data?.page !== undefined) {
          responseData.meta = {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: data.totalPages,
          };
          responseData.data = data.data;
        }

        return responseData;
      }),
    );
  }
}
