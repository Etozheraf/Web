import { IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';

export class UpdateInternshipDto {
  @IsOptional()
  @IsString()
  name?: string;           

  @IsOptional()
  @IsString()
  category?: string;       

  @IsOptional()
  @IsString()
  date?: string;          

  @IsOptional()
  @IsUrl()
  companyUrl?: string;

  @IsOptional()
  @IsBoolean()
  closed?: boolean;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
