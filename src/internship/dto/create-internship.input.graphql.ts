import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsArray,
} from 'class-validator';

@InputType({ description: 'Данные для создания новой стажировки' })
export class CreateInternshipInput {
  @Field({ description: 'Название компании' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Название категории стажировки' })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @Field({ description: 'Дата окончания текущего этапа стажировки' })
  @IsString()
  @IsNotEmpty()
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
  tags: string[];

  @Field({ description: 'URL изображения логотипа' })
  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}
