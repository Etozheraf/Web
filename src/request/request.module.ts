import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { InternshipModule } from '../internship/internship.module';

@Module({
  imports: [PrismaModule, CategoryModule, InternshipModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
