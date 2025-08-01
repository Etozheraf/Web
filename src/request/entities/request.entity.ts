import { ApiProperty } from '@nestjs/swagger';
import { Internship } from '../../internship/entities/internship.entity';
import { User } from '../../user/entities/user.entity';

export class Request {
  @ApiProperty({
    example: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    description: 'The unique identifier of the request',
  })
  uuid: string;

  @ApiProperty({
    example: 'My first request',
    description: 'The name of the request',
  })
  name: string;

  @ApiProperty({
    example: 'Active',
    description: 'The status of the request',
  })
  status: string;

  @ApiProperty({
    example: '2025-09-01 - 2025-12-01',
    description: 'The dates of the request',
  })
  dates: string;

  @ApiProperty({ type: () => Internship })
  internship: Internship;

  @ApiProperty({ type: () => User })
  user: User;
}