import { Global, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryApiController } from './category-api.controller';
import { CategoryGraphQLResolver } from './category-graphql.resolver';

@Global()
@Module({
  controllers: [CategoryController, CategoryApiController],
  providers: [CategoryService, CategoryGraphQLResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
