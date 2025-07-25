import { Global, Module } from '@nestjs/common';
import { CategoryService } from './category.service';

@Global()
@Module({
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule { }
