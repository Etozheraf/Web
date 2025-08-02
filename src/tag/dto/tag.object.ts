import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Тег/технология стажировки' })
export class TagObject {
  @Field(() => ID, { description: 'Уникальный идентификатор тега' })
  uuid: string;

  @Field({ description: 'Название тега' })
  name: string;
}
