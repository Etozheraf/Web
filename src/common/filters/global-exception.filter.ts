import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const isApiRoute = request.url.startsWith('/api/');

      console.log(exception);

      if (isApiRoute) {
        if (status >= 500) {
          response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
          });
          return;
        }
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          message: message,
        });
        return;
      }

      if (status >= 500) {
        response.status(status).render('pages/error', {
          statusCode: status,
        });
        return;
      }
      response.status(status).render('pages/error', {
        message: message,
        statusCode: status,
      });
    } else if (host.getType<any>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      console.error(exception);
      return exception;
    }
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && 'message' in response) {
        const message = (response as any).message;
        if (Array.isArray(message)) {
          return message.join('\n');
        }
        return message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
