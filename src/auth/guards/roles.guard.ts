import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { SessionRequest } from 'supertokens-node/framework/express';
import UserRoles from 'supertokens-node/recipe/userroles';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<SessionRequest>();
    const res = ctx.getResponse();

    try {
      const session = await Session.getSession(req, res);  
      const userId = session.getUserId();
      const userRoles = await UserRoles.getRolesForUser('public', userId);
      console.log("userRoles", userRoles);
      if (requiredRoles.some((role) => userRoles.roles.includes(role))) {
        return true;
      }
      throw new ForbiddenException(`Only for ${requiredRoles.join(', ')}`);
    } catch {
      throw new ForbiddenException(`Only for ${requiredRoles.join(', ')}`);
    }
  }
}
