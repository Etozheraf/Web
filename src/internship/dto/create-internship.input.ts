import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsArray,
  Length,
  Matches,
} from 'class-validator';

export class CreateInternshipInput {
  @ApiProperty({ example: 'Yandex', description: 'The name of the internship' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @ApiProperty({ example: 'ML', description: 'The internship category name' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Category must contain only letters, spaces' })
  @Length(2, 30, { message: 'Category must be between 2 and 30 characters' })
  categoryName: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'The end date of the current stage of the internship',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zА-Яа-яЁё0-9\s\.\-]*$/u, { message: 'Date must contain only letters, spaces, numbers, dots and hyphens' })
  date: string;

  @ApiProperty({
    example: 'https://company.com',
    description: 'The URL of the company',
  })
  @IsUrl()
  companyUrl: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the internship is closed for applications',
  })
  @IsBoolean()
  closed: boolean;

  @ApiProperty({
    type: [String],
    example: ['JavaScript', 'React'],
    description: 'A list of tags associated with the internship',
  })
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { each: true, message: 'Tags must contain only letters, spaces' })
  @Length(2, 30, { each: true, message: 'Tags must be between 2 and 30 characters' })
  tags: string[];
}
