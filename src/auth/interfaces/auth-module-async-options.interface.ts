import { ModuleMetadata } from '@nestjs/common';
import { AuthModuleConfig } from '../config.interface';

export interface AuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<AuthModuleConfig> | AuthModuleConfig;
  inject?: any[];
}
