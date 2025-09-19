import { Injectable } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';
import { Role } from './role.enum';

@Injectable()
export class RolesService {
  async addRoleToUser(userId: string, role: Role): Promise<void> {
    const result = await UserRoles.addRoleToUser('public', userId, role);
    if (result.status === 'UNKNOWN_ROLE_ERROR') {
      await UserRoles.createNewRoleOrAddPermissions(role, []);
      await UserRoles.addRoleToUser('public', userId, role);
    }
  }

  async removeRoleFromUser(userId: string, role: string): Promise<void> {
    await UserRoles.removeUserRole('public', userId, role);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const result = await UserRoles.getRolesForUser('public', userId);
    return result.roles;
  }

  async createRole(role: string): Promise<void> {
    await UserRoles.createNewRoleOrAddPermissions(role, []);
  }

  async getAllRoles(): Promise<string[]> {
    const result = await UserRoles.getAllRoles();
    return result.roles;
  }
} 