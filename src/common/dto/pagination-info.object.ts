import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Информация о пагинации' })
export class PaginationInfo {
  @Field(() => Int, { description: 'Общее количество элементов' })
  totalCount: number;

  @Field(() => Int, { description: 'Общее количество страниц' })
  totalPages: number;

  @Field(() => Int, { description: 'Текущая страница' })
  currentPage: number;

  @Field(() => Int, { description: 'Количество элементов на странице' })
  limit: number;

  @Field({ description: 'Есть ли следующая страница' })
  hasNextPage: boolean;

  @Field({ description: 'Есть ли предыдущая страница' })
  hasPreviousPage: boolean;
}