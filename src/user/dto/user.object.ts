import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Пользователь системы' })
export class UserObject {
  @Field(() => ID, { description: 'Уникальный идентификатор пользователя' })
  uuid: string;

  @Field({ description: 'Email пользователя' })
  email: string;
}
