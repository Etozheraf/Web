import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  redirectToInternships(@Res() res: Response) {
    return res.redirect('/internship?category=Backend');
  }
}
