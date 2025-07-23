import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [InternshipController],
  providers: [InternshipService, PrismaService],
})
export class InternshipModule {}
