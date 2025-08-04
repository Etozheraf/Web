import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsBoolean,
  IsArray,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class UpdateInternshipInput {
  @ApiProperty({
    example: 'Yandex',
    description: 'The name of the internship',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name?: string;

  @ApiProperty({
    example: 'https://new-company.com',
    description: 'The updated URL of the company',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'The end date of the current stage of the internship',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё0-9\s\.\-]*$/u, {
    message: 'Date must contain only letters, spaces, numbers, dots and hyphens',
  })
  date?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the internship is closed for applications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  closed?: boolean;

  @ApiProperty({
    example: 'ML',
    description: 'The internship category name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Category must contain only letters, spaces' })
  @Length(2, 30, { message: 'Category must be between 2 and 30 characters' })
  categoryName?: string;

  @ApiProperty({
    type: [String],
    example: ['TypeScript', 'Angular'],
    description: 'An updated list of tags associated with the internship',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { each: true, message: 'Tags must contain only letters, spaces' })
  @Length(2, 30, { each: true, message: 'Tags must be between 2 and 30 characters' })
  tags?: string[];
}
