import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CategoryObject } from '../../category/dto/category.object';
import { TagObject } from '../../tag/dto/tag.object';

@ObjectType({ description: 'Стажировка' })
export class InternshipObject {
  @Field(() => ID, { description: 'Уникальный идентификатор стажировки' })
  uuid: string;

  @Field({ description: 'Название компании' })
  name: string;

  @Field({ description: 'Дата окончания текущего этапа стажировки' })
  date: string;

  @Field({ description: 'URL изображения логотипа компании' })
  imgUrl: string;

  @Field({ description: 'URL компании' })
  companyUrl: string;

  @Field({ description: 'Закрыта ли подача заявок на стажировку' })
  closed: boolean;

  @Field(() => CategoryObject, { description: 'Категория стажировки' })
  category: CategoryObject;

  @Field(() => [TagObject], { description: 'Теги/технологии стажировки' })
  tags: TagObject[];
}