import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    let req: any;
    let res: any;
    let method = 'GRAPHQL';
    let url = context.getClass().name; // для GraphQL можно выводить имя ресолвера

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      req = gqlCtx.req;
      res = gqlCtx.res;

      // если Express req/res проброшены через GraphQLModule
      if (req?.method && req?.url) {
        method = req.method;
        url = req.url;
      }
    } else {
      req = context.switchToHttp().getRequest();
      res = context.switchToHttp().getResponse();
      method = req.method;
      url = req.url;
    }

    const acceptHeader = req?.headers?.['accept'] || '';

    if (acceptHeader.includes('text/event-stream')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        this.logger.log(`[${method}] ${url} - ${elapsedTime}ms`);

        if (!acceptHeader.includes('text/html') && res && !res.headersSent) {
          res.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
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
