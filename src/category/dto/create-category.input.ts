import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length, IsAlpha, Matches } from 'class-validator';

@InputType({ description: 'Данные для создания новой категории' })
export class CreateCategoryInput {
  @Field({ description: 'Название категории' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;
}
