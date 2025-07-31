import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserApiController } from './user-api.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [UserController, UserApiController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
