import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'ML',
    description: 'The updated name of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
