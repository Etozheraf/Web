import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import {
  AuthModuleConfig,
  SuperTokensConfigInjectionToken,
} from '../config.interface';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(SuperTokensConfigInjectionToken) private config: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: {
        appName: 'Internships aggregator',
        websiteDomain: 'http://localhost:3000',
        apiDomain: 'http://localhost:3000',
        apiBasePath: '/api/auth',
      },
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(), 
        Session.init({
          getTokenTransferMethod: () => "cookie",
          cookieSameSite: 'lax',
          cookieSecure: false,
        }), 
        UserRoles.init()],
    });
  }
}


