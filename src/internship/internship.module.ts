import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { InternshipApiController } from './internship-api.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [PrismaModule, CategoryModule, TagModule],
  controllers: [InternshipController, InternshipApiController],
  providers: [InternshipService],
  exports: [InternshipService],
})
export class InternshipModule {}
