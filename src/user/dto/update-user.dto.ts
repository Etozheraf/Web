import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Johnathan Doe',
    description: 'The updated name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name?: string;

  @ApiProperty({
    example: 'john.doe.new@example.com',
    description: 'The updated email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
