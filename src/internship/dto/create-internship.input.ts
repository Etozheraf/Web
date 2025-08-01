import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateInternshipInput {
  @ApiProperty({ example: 'Yandex', description: 'The name of the internship' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ML', description: 'The internship category name' })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({ example: '2025-09-01', description: 'The end date of the current stage of the internship' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'https://company.com', description: 'The URL of the company' })
  @IsUrl()
  companyUrl: string;

  @ApiProperty({ example: false, description: 'Indicates if the internship is closed for applications' })
  @IsBoolean()
  closed: boolean;

  @ApiProperty({ type: [String], example: ['JavaScript', 'React'], description: 'A list of tags associated with the internship' })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '/img/logo.png', description: 'The URL of the internship image' })
  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}