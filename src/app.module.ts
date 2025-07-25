import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InternshipModule } from './internship/internship.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    PrismaModule,
    InternshipModule,
    UserModule,
    RequestModule,
    CategoryModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
