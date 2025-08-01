import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'JavaScript', description: 'The tag content' })
  @IsNotEmpty()
  @IsString()
  name: string;
}