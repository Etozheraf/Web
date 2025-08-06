import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { RequestApiController } from './request-api.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { InternshipModule } from '../internship/internship.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, CategoryModule, InternshipModule, UserModule],
  controllers: [RequestController, RequestApiController],
  providers: [RequestService],
})
export class RequestModule {}
