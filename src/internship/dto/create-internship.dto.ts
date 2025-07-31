import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

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
  closed: boolean;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsNotEmpty()
  @IsUrl()
  imgUrl: string;
}
