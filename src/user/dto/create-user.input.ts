import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

@InputType({ description: 'Данные для создания нового пользователя' })
export class CreateUserInput {
  @Field({ description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @Field({ description: 'Пароль пользователя' })
  @IsString()
  @MinLength(6)
  password: string;
}
