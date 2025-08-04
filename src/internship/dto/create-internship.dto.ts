import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInternshipDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Category must contain only letters, spaces' })
  @Length(2, 30, { message: 'Category must be between 2 and 30 characters' })
  category: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё0-9\s\.\-]*$/u, {
    message: 'Date must contain only letters, spaces, numbers, dots and hyphens',
  })
  date?: string;

  @IsNotEmpty()
  @IsUrl()
  companyUrl: string;
  
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  closed: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s,]*$/u, { message: 'Tags must contain only letters, spaces and commas' })
  tags?: string;
}
