import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInternshipDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsNotEmpty()
  @IsUrl()
  companyUrl: string;
  
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  closed: boolean;

  @IsOptional()
  @IsString()
  tags?: string;
}
