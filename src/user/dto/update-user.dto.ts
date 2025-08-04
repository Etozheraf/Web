import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
  Length,
  IsAlphanumeric,
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

  @ApiProperty({
    example: 'newPassword123',
    description: 'The new password for the user',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric('en-US', { message: 'Password must contain only numbers and english letters' })
  @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
  password?: string;

  @ApiProperty({
    example: 'password123',
    description:
      'The current password of the user (required to update any user data)',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword?: string;
}
