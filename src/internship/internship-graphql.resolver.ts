import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { InternshipService } from './internship.service';
import { InternshipObject } from './dto/internship.object';
import { CreateInternshipInput } from './dto/create-internship.input.graphql';
import { UpdateInternshipInput } from './dto/update-internship.input.graphql';

@Resolver(() => InternshipObject)
export class InternshipGraphQLResolver {
  constructor(private readonly internshipService: InternshipService) {}

  @Query(() => [InternshipObject], {
    name: 'internshipsByCategory',
    description: 'Получить список стажировок по категории',
  })
  async findInternshipsByCategory(
    @Args('categoryName', { description: 'Название категории' })
    categoryName: string,
  ): Promise<InternshipObject[]> {
    return this.internshipService.findByCategory(categoryName);
  }

  @Query(() => InternshipObject, {
    name: 'internship',
    description: 'Получить стажировку по ID',
  })
  async findOneInternship(
    @Args('id', { type: () => ID, description: 'ID стажировки' }) id: string,
  ): Promise<InternshipObject> {
    return this.internshipService.findOne(id);
  }

  @Query(() => InternshipObject, {
    name: 'internshipByNameAndCategory',
    description: 'Найти стажировку по названию и категории',
  })
  async findInternshipByNameAndCategory(
    @Args('name', { description: 'Название стажировки' }) name: string,
    @Args('categoryName', { description: 'Название категории' })
    categoryName: string,
  ): Promise<InternshipObject | null> {
    return this.internshipService.findByNameAndCategory(name, categoryName);
  }

  @Mutation(() => InternshipObject, {
    name: 'createInternship',
    description: 'Создать новую стажировку',
  })
  async createInternship(
    @Args('createInternshipInput') createInternshipInput: CreateInternshipInput,
  ): Promise<InternshipObject> {
    return this.internshipService.create(createInternshipInput);
  }

  @Mutation(() => InternshipObject, {
    name: 'updateInternship',
    description: 'Обновить стажировку',
  })
  async updateInternship(
    @Args('updateInternshipInput') updateInternshipInput: UpdateInternshipInput,
  ): Promise<InternshipObject> {
    return this.internshipService.update(
      updateInternshipInput.uuid,
      updateInternshipInput,
    );
  }

  @Mutation(() => InternshipObject, {
    name: 'publishInternship',
    description: 'Открыть стажировку для подачи заявок',
  })
  async publishInternship(
    @Args('id', { type: () => ID, description: 'ID стажировки' }) id: string,
  ): Promise<InternshipObject> {
    return this.internshipService.update(id, { closed: false });
  }

  @Mutation(() => InternshipObject, {
    name: 'hideInternship',
    description: 'Закрыть стажировку для подачи заявок',
  })
  async hideInternship(
    @Args('id', { type: () => ID, description: 'ID стажировки' }) id: string,
  ): Promise<InternshipObject> {
    return this.internshipService.update(id, { closed: true });
  }

  @Mutation(() => Boolean, {
    name: 'removeInternship',
    description: 'Удалить стажировку',
  })
  async removeInternship(
    @Args('id', { type: () => ID, description: 'ID стажировки' }) id: string,
  ): Promise<boolean> {
    await this.internshipService.remove(id);
    return true;
  }
}
