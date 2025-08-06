import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const acceptHeader = request.headers['accept'] || '';

    if (acceptHeader.includes('text/event-stream')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        this.logger.log(`[${method}] ${url} - ${elapsedTime}ms`);

        if (!acceptHeader.includes('text/html') && !response.headersSent) {
          response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
        }
      }),
      map((data) => {
        const elapsedTime = Date.now() - startTime;

        if (
          acceptHeader.includes('text/html') &&
          typeof data === 'object' &&
          data !== null &&
          !Array.isArray(data)
        ) {
          return { ...data, elapsedTime: `${elapsedTime}ms` };
        }

        return data;
      }),
    );
  }
}
