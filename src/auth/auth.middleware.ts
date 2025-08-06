import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: any;
  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: any, res: any, next: () => void) {
    return this.supertokensMiddleware(req, res, next);
  }
}
