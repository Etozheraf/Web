import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { InternshipApiController } from './internship-api.controller';
import { InternshipGraphQLResolver } from './internship-graphql.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, CategoryModule, TagModule, StorageModule, UserModule],
  controllers: [InternshipController, InternshipApiController],
  providers: [InternshipService, InternshipGraphQLResolver],
  exports: [InternshipService],
})
export class InternshipModule {}
