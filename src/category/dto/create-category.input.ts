import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Данные для создания новой категории' })
export class CreateCategoryInput {
  @Field({ description: 'Название категории' })
  @IsString()
  @IsNotEmpty()
  name: string;
}