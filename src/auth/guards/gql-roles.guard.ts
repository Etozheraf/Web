import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();

    try {
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();
      const userRoles = await UserRoles.getRolesForUser('public', userId);

      if (requiredRoles.some((role) => userRoles.roles.includes(role))) {
        return true;
      }
      throw new ForbiddenException(`Only for ${requiredRoles.join(', ')}`);
    } catch {
      throw new ForbiddenException(`Only for ${requiredRoles.join(', ')}`);
    }
  }
}
