import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @Render('pages/form')
  async showRequestsPage(@Query('auth') auth: string) {
    const isAuthorized = auth === 'Rafael';
    let user: any;
    if (isAuthorized) {
      user = { name: 'Rafael' };
    } else {
      user = null;
    }

    const myRequests = await this.requestService.findAll();
    const internships = await this.requestService.getAvailableInternships();

    return {
      styles: [
        "blocks/internship-form/internship-form.css",
        "blocks/internship-form/internship-form__button.css",
        "blocks/internship-form/internship-form__button_lighter.css",
        "blocks/internship-form/internship-form__input.css",
        "blocks/internship-form/internship-form__label.css",
        "blocks/internships-table/internships-table.css",
        "blocks/internships-table/internships-table__td.css",
        "blocks/internships-table/internships-table__td_header.css",
        "blocks/internships-table/internships-table__td_last.css",
        "blocks/main/main__title.css",
        "blocks/toast-bottom-right/toast-bottom-right.css"
      ],
      scripts: [
        "blocks/internship-form/internship-form__button.js",
        "blocks/toast-bottom-right/toast-bottom-right.js"
      ],
      menu: [
        {
          href: '/internships',
          active: false,
          label: 'Internships'
        },
        {
          href: '/requests',
          active: true,
          label: 'My Requests'
        },
        {
          href: '/user',
          active: false,
          label: 'Profile'
        }
      ],
      user: user,
      myRequests: myRequests,
      internships: internships,
      contacts: [
        {
          "label": "Почта",
          "href": "#",
        },
        {
          "label": "Telegram",
          "href": "#",
        },
        {
          "label": "VK",
          "href": "#",
        }
      ],
      location: "г. Санкт-Петербург 52"
    };
  }

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @Res() res: Response) {
    await this.requestService.create(createRequestDto);
    return res.redirect('/requests');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @Res() res: Response) {
    await this.requestService.update(+id, updateRequestDto);
    return res.redirect('/requests');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.requestService.remove(+id);
    return res.redirect('/requests');
  }
}
