import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    example: 'My first request',
    description: 'The name of the request',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Yandex', description: 'The name of the internship' })
  @IsNotEmpty()
  @IsString()
  internshipName: string;

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
  dates: string;

  @ApiProperty({ example: 'ML', description: 'The category of the internship' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    description: 'The UUID of the user making the request',
  })
  @IsNotEmpty()
  @IsUUID()
  userUuid: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'The UUID of the internship',
  })
  @IsNotEmpty()
  @IsUUID()
  internshipUuid: string;
}
