import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'The unique identifier of the category',
  })
  uuid: string;

  @ApiProperty({
    example: 'ML',
    description: 'The name of the category',
  })
  name: string;
}