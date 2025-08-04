import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, Length, Matches, IsAlphanumeric } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric('en-US', { message: 'Password must contain only numbers and english letters' })
  @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
  password: string;
}
