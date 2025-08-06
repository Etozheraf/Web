import { Global, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagApiController } from './tag-api.controller';
import { TagGraphQLResolver } from './tag-graphql.resolver';
import { CategoryModule } from '../category/category.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [CategoryModule, UserModule],
  controllers: [TagController, TagApiController],
  providers: [TagService, TagGraphQLResolver],
  exports: [TagService],
})
export class TagModule {}
