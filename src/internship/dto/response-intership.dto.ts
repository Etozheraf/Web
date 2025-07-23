import { Internship } from '../entities/internship.entity';

export class ResponseInternshipDto {
  private static readonly companyStyleMap: Record<string, string> = {
    'Ozon': 'internship-card__header_ozon',
    'Касперский': 'internship-card__header_kaspersky',
    'Yadro': 'internship-card__header_yadro',
    'Лига Цифровой Экономики': 'internship-card__header_liga',
  };

  id: number;
  name: string;
  date: string;
  imgUrl: string;
  url: string;
  closed: boolean;
  customClass: string;

  constructor(entity: Internship) {
    this.id = entity.id;
    this.name = entity.name;
    this.date = entity.date;
    this.imgUrl = entity.imgUrl;
    this.url = entity.companyUrl;
    this.closed = entity.closed;
    this.customClass = ResponseInternshipDto.companyStyleMap[entity.name] || '';
  }
}