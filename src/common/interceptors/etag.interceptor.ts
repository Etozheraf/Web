import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    return next.handle().pipe(
      tap((data) => {
        if (!data || response.headersSent) {
          return;
        }

        const etag = crypto
          .createHash('sha1')
          .update(JSON.stringify(data))
          .digest('hex');

        const ifNoneMatch = request.headers['if-none-match'];

        if (response.headersSent) return;

        if (ifNoneMatch === etag) {
          response.status(304).end();
        } else {
          response.header('ETag', etag);
        }
      }),
    );
  }
}
