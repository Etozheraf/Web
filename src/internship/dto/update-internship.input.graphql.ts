import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateInternshipInput } from './create-internship.input.graphql';
import { IsUUID } from 'class-validator';

@InputType({ description: 'Данные для обновления стажировки' })
export class UpdateInternshipInput extends PartialType(CreateInternshipInput) {
  @Field(() => ID, { description: 'Уникальный идентификатор стажировки' })
  @IsUUID()
  uuid: string;
}