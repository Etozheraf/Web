import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive, Max } from 'class-validator';

@InputType({ description: 'Параметры пагинации' })
export class PaginationInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
    description: 'Номер страницы (начиная с 1)',
  })
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
    description: 'Количество элементов на странице (максимум 100)',
  })
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit?: number = 10;
}
