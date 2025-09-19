import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import Session from 'supertokens-node/recipe/session';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    let req, res;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      req = gqlCtx.req;
      res = gqlCtx.res;
    } else {
      const httpCtx = context.switchToHttp();
      req = httpCtx.getRequest();
      res = httpCtx.getResponse();
    }

    try {
      await Session.getSession(req, res, { sessionRequired: true });
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
