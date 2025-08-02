import { ApiProperty } from '@nestjs/swagger';

export class Tag {
  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    description: 'The unique identifier of the tag',
  })
  uuid: string;

  @ApiProperty({
    example: 'JavaScript',
    description: 'The tag content',
  })
  name: string;
}
