import { ObjectType, Field } from '@nestjs/graphql';
import { InternshipObject } from './internship.object';
import { PaginationInfo } from '../../common/dto/pagination-info.object';

@ObjectType({ description: 'Пагинированный список стажировок' })
export class InternshipsPaginated {
  @Field(() => [InternshipObject], { description: 'Список стажировок' })
  items: InternshipObject[];

  @Field(() => PaginationInfo, { description: 'Информация о пагинации' })
  pageInfo: PaginationInfo;
}