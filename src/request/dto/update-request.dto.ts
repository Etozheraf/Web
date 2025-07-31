import { IsOptional, IsString, IsIn, IsUUID } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  internshipName?: string;

  @IsOptional()
  @IsIn(['Active', 'Closed'])
  status?: 'Active' | 'Closed';

  @IsOptional()
  @IsString()
  dates?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUUID()
  userUuid?: string;

  @IsOptional()
  @IsUUID()
  internshipUuid?: string;
}
