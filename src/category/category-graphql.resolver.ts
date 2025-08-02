import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryObject } from './dto/category.object';
import { CreateCategoryInput } from './dto/create-category.input';

@Resolver(() => CategoryObject)
export class CategoryGraphQLResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryObject], {
    name: 'categories',
    description: 'Получить список всех категорий',
  })
  async findAllCategories(): Promise<CategoryObject[]> {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryObject, {
    name: 'category',
    description: 'Получить категорию по ID',
  })
  async findOneCategory(
    @Args('id', { type: () => ID, description: 'ID категории' }) id: string,
  ): Promise<CategoryObject> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => CategoryObject, {
    name: 'createCategory',
    description: 'Создать новую категорию',
  })
  async createCategory(
    @Args('createCategoryInput', { type: () => CreateCategoryInput })
    createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryObject> {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => Boolean, {
    name: 'removeCategory',
    description: 'Удалить категорию',
  })
  async removeCategory(
    @Args('id', { type: () => ID, description: 'ID категории' }) id: string,
  ): Promise<boolean> {
    await this.categoryService.remove(id);
    return true;
  }
}
