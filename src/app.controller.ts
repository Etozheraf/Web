import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  redirectToInternships(@Res() res: Response) {
    return res.redirect('/internship?category=Backend');
  }
}
