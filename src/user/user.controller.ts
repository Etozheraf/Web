import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('pages/user')
  async getProfile(@Query('auth') auth: string) {
    const isAuthorized = auth === 'Rafael';
    let user: any;
    
    if (isAuthorized) {
      user = await this.userService.findByName('Rafael');
    } else {
      user = null;
    }

    return {
      styles: [
        "blocks/loader/loader.css",
        "blocks/loader/loader__spinner.css",
        "blocks/main/main__title.css",
        "blocks/user-profile/user-profile.css",
        "blocks/user-profile/user-profile__el.css",
        "blocks/user-profile/user-profile__el_hidden.css",
      ],
      scripts: [
        "blocks/user-profile/user-profile.js"
      ],
      menu: [
        {
          href: '/internships',
          active: false,
          label: 'Internships'
        },
        {
          href: '/requests',
          active: false,
          label: 'My Requests'
        },
        {
          href: '/user',
          active: true,
          label: 'Profile'
        }
      ],
      user: user || {
        name: 'Guest',
        email: 'guest@example.com'
      },

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
