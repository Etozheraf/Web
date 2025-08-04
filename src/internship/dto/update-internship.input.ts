import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateInternshipInput {
  @ApiProperty({
    example: 'Yandex',
    description: 'The name of the internship',
    required: false,
  })
  @IsOptional()
  @IsString()
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
  tags?: string[];
}
