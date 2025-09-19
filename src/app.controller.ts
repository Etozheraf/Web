import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess } from './auth/decorators/public.decorator';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}

  @PublicAccess()
  @Get('/')
  redirectToInternships(@Res() res: Response) {
    return res.redirect('/internship?category=Backend');
  }
}
