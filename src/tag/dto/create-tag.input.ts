import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Данные для создания нового тега' })
export class CreateTagInput {
  @Field({ description: 'Название тега' })
  @IsString()
  @IsNotEmpty()
  name: string;
}