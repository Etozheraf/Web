import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsArray,
  Length,
  Matches,
} from 'class-validator';

@InputType({ description: 'Данные для создания новой стажировки' })
export class CreateInternshipInput {
  @Field({ description: 'Название компании' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @Field({ description: 'Название категории стажировки' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Category must contain only letters, spaces' })
  @Length(2, 30, { message: 'Category must be between 2 and 30 characters' })
  categoryName: string;

  @Field({ description: 'Дата окончания текущего этапа стажировки' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё0-9\s\.\-]*$/u, {
    message: 'Date must contain only letters, spaces, numbers, dots and hyphens',
  })
  date: string;

  @Field({ description: 'URL компании' })
  @IsUrl()
  companyUrl: string;

  @Field({ description: 'Закрыта ли подача заявок' })
  @IsBoolean()
  closed: boolean;

  @Field(() => [String], { description: 'Список тегов/технологий' })
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { each: true, message: 'Tags must contain only letters, spaces' })
  @Length(2, 30, { each: true, message: 'Tags must be between 2 and 30 characters' })
  tags: string[];

  @Field({ description: 'URL изображения логотипа' })
  @IsUrl()
  imgUrl: string;
}
