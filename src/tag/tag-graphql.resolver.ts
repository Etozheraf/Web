import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { TagObject } from './dto/tag.object';
import { CreateTagInput } from './dto/create-tag.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/role.enum';
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard';

@Resolver(() => TagObject)
@UseGuards(GqlRolesGuard)
@Roles(Role.Admin)
export class TagGraphQLResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [TagObject], {
    name: 'tags',
    description: 'Получить список всех тегов',
  })
  async findAllTags(): Promise<TagObject[]> {
    return this.tagService.findAll();
  }

  @Query(() => TagObject, {
    name: 'tag',
    description: 'Получить тег по ID',
  })
  async findOneTag(
    @Args('id', { type: () => ID, description: 'ID тега' }) id: string,
  ): Promise<TagObject> {
    return this.tagService.findOne(id);
  }

  @Mutation(() => TagObject, {
    name: 'createTag',
    description: 'Создать новый тег',
  })
  async createTag(
    @Args('createTagInput') createTagInput: CreateTagInput,
  ): Promise<TagObject> {
    return this.tagService.create(createTagInput);
  }

  @Mutation(() => Boolean, {
    name: 'removeTag',
    description: 'Удалить тег',
  })
  async removeTag(
    @Args('id', { type: () => ID, description: 'ID тега' }) id: string,
  ): Promise<boolean> {
    await this.tagService.remove(id);
    return true;
  }
}
