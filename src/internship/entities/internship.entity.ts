import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

export class Internship {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'The unique identifier of the internship',
  })
  uuid: string;

  @ApiProperty({
    example: 'Yandex',
    description: 'The name of the internship',
  })
  name: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'The end date of the current stage of the internship',
  })
  date: string;

  @ApiProperty({
    example: '/img/logo.png',
    description: 'The URL of the internship image',
  })
  imgUrl: string;

  @ApiProperty({
    example: 'https://company.com',
    description: 'The URL of the company',
  })
  companyUrl: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the internship is closed for applications',
  })
  closed: boolean;

  @ApiProperty({ type: () => Category })
  category: Category;

  @ApiProperty({ type: () => [Tag] })
  tags: Tag[];
}