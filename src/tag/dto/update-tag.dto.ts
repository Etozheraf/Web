import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({ example: 'TypeScript', description: 'The updated tag content', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}