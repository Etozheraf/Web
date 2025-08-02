import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Категория стажировки' })
export class CategoryObject {
  @Field(() => ID, { description: 'Уникальный идентификатор категории' })
  uuid: string;

  @Field({ description: 'Название категории' })
  name: string;
}