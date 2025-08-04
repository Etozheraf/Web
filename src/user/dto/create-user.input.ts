import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength, Length, Matches, IsAlphanumeric } from 'class-validator';

@InputType({ description: 'Данные для создания нового пользователя' })
export class CreateUserInput {
  @Field({ description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @Field({ description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @Field({ description: 'Пароль пользователя' })
  @IsString()
  @IsAlphanumeric('en-US', { message: 'Password must contain only numbers and english letters' })
  @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
  password: string;
}
