import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsUUID, Length, Matches } from 'class-validator';

export class CreateApiRequestDto {
  @ApiProperty({
    example: 'My first request',
    description: 'The name of the request',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё\s]+$/u, { message: 'Name must contain only letters, spaces' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'The UUID of the internship',
  })
  @IsNotEmpty()
  @IsUUID()
  internshipUuid: string;

  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    description: 'The UUID of the user making the request',
  })
  @IsNotEmpty()
  @IsUUID()
  userUuid: string;

  @ApiProperty({
    example: 'Active',
    description: 'The status of the request',
    enum: ['Active', 'Closed'],
  })
  @IsNotEmpty()
  @IsIn(['Active', 'Closed'])
  status: 'Active' | 'Closed';

  @ApiProperty({
    example: '2025-09-01 - 2025-12-01',
    description: 'The dates of the request',
  })
  @IsString()
  @Matches(/^[A-Za-zА-Яа-яЁё0-9\s\.\-]*$/u, {
    message: 'Dates must contain only letters, spaces, numbers, dots and hyphens',
  })
  dates: string;
}
