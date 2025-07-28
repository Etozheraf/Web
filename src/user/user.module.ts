import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
