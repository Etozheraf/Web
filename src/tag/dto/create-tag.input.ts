import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

@InputType({ description: 'Данные для создания нового тега' })
export class CreateTagInput {
  @Field({ description: 'Название тега' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;
}
