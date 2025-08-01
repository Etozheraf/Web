import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    description: 'The unique identifier of the user',
  })
  uuid: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;
}