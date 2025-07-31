import { IsNotEmpty, IsString, IsIn, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  internshipName: string;

  @IsNotEmpty()
  @IsIn(['Active', 'Closed'])
  status: 'Active' | 'Closed';

  @IsString()
  dates: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsUUID()
  userUuid: string;

  @IsNotEmpty()
  @IsUUID()
  internshipUuid: string;
}
