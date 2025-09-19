import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'ML', description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  name: string;
}
