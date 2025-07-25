import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';

@Module({
  controllers: [InternshipController],
  providers: [InternshipService],
})
export class InternshipModule {}
