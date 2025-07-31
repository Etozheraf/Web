import { Global, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryApiController } from './category-api.controller';

@Global()
@Module({
  controllers: [CategoryController, CategoryApiController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule { }
