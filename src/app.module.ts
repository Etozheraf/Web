import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InternshipModule } from './internship/internship.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [InternshipModule, UserModule, RequestModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
