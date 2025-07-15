import { Controller, Get, Render, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  @Render('pages/internships')
  getIndex(@Query('auth') auth: string) {
    const isAuthorized = auth === 'Rafael';
    let user: any
    if (isAuthorized) {
      user = { name: 'Rafael' };
    } else {
      user = null;
    }

    return {
      styles: [
        "blocks/internship-card/internship-card.css",
        "blocks/internship-card/internship-card__description.css",
        "blocks/internship-card/internship-card__header.css",
        "blocks/internship-card/internship-card__header_kaspersky.css",
        "blocks/internship-card/internship-card__header_liga.css",
        "blocks/internship-card/internship-card__header_ozon.css",
        "blocks/internship-card/internship-card__header_yadro.css",
        "blocks/internship-card/internship-card__logo.css",
        "blocks/internship-card/internship-card_closed.css",
        "blocks/internships-list/internships-list.css",
        "blocks/internships-list/internships-list_title.css",
      ],

      menu: [
        {
          href: '/',
          active: true,
          label: 'Backend'
        },
        {
          href: '/frontend',
          active: false,
          label: 'Frontend'
        },
        {
          href: '/ml',
          active: false,
          label: 'ML'
        }
      ],

      user: user,

      internships: [
        {
          "name": "Яндекс",
          "href": "https://yandex.ru/yaintern/internship",
          "logo": "img/Yandex.png",
          "alt": "Яндекс",
          "closed": false,
          "headerClass": "",
          "status": "Открыта весь год"
        },
        {
          "name": "Т-банк",
          "href": "https://education.tbank.ru/start/",
          "logo": "img/Tinkoff.svg",
          "alt": "Т-банк",
          "closed": false,
          "headerClass": "",
          "status": "<time datetime=\"2024-12-01\">Регистрация до 30 января</time>"
        },
        {
          "name": "Ozon",
          "href": "https://route256.ozon.ru/?rr=1",
          "logo": "img/Ozon.svg",
          "alt": "Озон Route",
          "closed": false,
          "headerClass": "internship-card__header_ozon",
          "status": "<time datetime=\"2024-12-01\">Регистрация до 26 января</time>"
        },
        {
          "name": "АТОН",
          "href": "https://career.aton.ru/start/ittp/",
          "logo": "img/Aton.png",
          "alt": "Атон",
          "closed": true,
          "headerClass": "",
          "status": "<time datetime=\"2025-04-01\">Закрыта до 1 апреля</time>"
        },
        {
          "name": "Касперский",
          "href": "https://safeboard.kaspersky.ru/",
          "logo": "img/Kaspersky.png",
          "alt": "Лаборатория Касперского",
          "closed": true,
          "headerClass": "internship-card__header_kaspersky"
        },
        {
          "name": "Yadro",
          "href": "https://careers.yadro.com/internship/",
          "logo": "img/Yadro.svg",
          "alt": "Yadro",
          "closed": true,
          "headerClass": "internship-card__header_yadro"
        },
        {
          "name": "МТС",
          "href": "https://job.mts.ru/programs/start",
          "logo": "img/mts.png",
          "alt": "МТС",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "СКБ Контур",
          "href": "https://kontur.ru/education/programs/intern?ysclid=lq4xv82jcd368102253",
          "logo": "img/kontur.svg",
          "alt": "Контур",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Альфа Банк",
          "href": "https://alfabank.ru/alfastudents/ichoosealfa/#directions",
          "logo": "img/Alfa.jpg",
          "alt": "Альфа Банк",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Авито",
          "href": "https://start.avito.ru/tech?ysclid=lq5ad4exyh714880742#popup:reginfo",
          "logo": "img/avito.svg",
          "alt": "Авито",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Сбербанк",
          "href": "https://sbergraduate.ru/sberseasons-moscow/",
          "logo": "img/sber.png",
          "alt": "Сбербанк",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "ВКонтакте",
          "href": "https://internship.vk.company/internship/",
          "logo": "img/vk.svg",
          "alt": "VK",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Райффайзенбанк",
          "href": "https://career.raiffeisen.ru/start",
          "logo": "img/Raif.jpg",
          "alt": "Райффайзенбанк",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "ВТБ",
          "href": "https://vtbcareer.com/",
          "logo": "img/vtb.svg",
          "alt": "ВТБ",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Мегафон",
          "href": "https://job.megafon.ru/vacancy/all",
          "logo": "img/megafon.svg",
          "alt": "Мегафон",
          "closed": true,
          "headerClass": ""
        },
        {
          "name": "Лига Цифровой Экономики",
          "href": "https://www.digitalleague.ru/traineeships/directions",
          "logo": "img/Liga.png",
          "alt": "Лига Цифровой Экономики",
          "closed": true,
          "headerClass": "internship-card__header_liga"
        }
      ],

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
    }
  }

  @Get('/form')
  @Render('pages/form')
  getForm(@Query('auth') auth: string) {
    const isAuthorized = auth === 'Rafael';
    let user: any
    if (isAuthorized) {
      user = { name: 'Rafael' };
    } else {
      user = null;
    }

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
          href: '/',
          active: false,
          label: 'Backend'
        },
        {
          href: '/frontend',
          active: false,
          label: 'Frontend'
        },
        {
          href: '/ml',
          active: false,
          label: 'ML'
        }
      ],
      user: user,

      myInternships: [
        {
          "name": "Яндекс Go",
          "status": "Активна",
          "dates": "01.02.2025 - 01.04.2025"
        },
        {
          "name": "Т-банк Backend",
          "status": "Завершена",
          "dates": "15.01.2025 - 15.03.2025"
        },
        {
          "name": "Ozon Route 256",
          "status": "Устарела",
          "dates": "10.12.2024 - 10.01.2025"
        }
      ],

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

  @Get('/user')
  @Render('pages/user')
  getProfile() {
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
          href: '/',
          active: false,
          label: 'Backend'
        },
        {
          href: '/frontend',
          active: false,
          label: 'Frontend'
        },
        {
          href: '/ml',
          active: false,
          label: 'ML'
        }
      ],
      user: {
        name: 'Rafael',
        email: '#'
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
}
