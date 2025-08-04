import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    example: 'TypeScript',
    description: 'The updated tag content',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name?: string;
}
