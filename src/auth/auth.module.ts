import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SupertokensService } from './supertokens/supertokens.service';
import { RolesService } from './roles.service';
import {
  AuthModuleConfig,
  SuperTokensConfigInjectionToken,
} from './config.interface';
import { AuthMiddleware } from './auth.middleware';
import { GqlRolesGuard } from './guards/gql-roles.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthApiController],
  providers: [
    AuthService,
    RolesService,
    AuthMiddleware,
    GqlRolesGuard,
  ],
  exports: [AuthService, RolesService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
  static forRootAsync(options: {
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => AuthModuleConfig;
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [...(options.imports ?? [])],
      providers: [
        {
          provide: SuperTokensConfigInjectionToken,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        {
          provide: SupertokensService,
          useFactory: (config: AuthModuleConfig) =>
            new SupertokensService(config),
          inject: [SuperTokensConfigInjectionToken],
        },
      ],
      exports: [SupertokensService],
    };
  }
}


