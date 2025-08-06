import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserObject } from './dto/user.object';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => UserObject)
export class UserGraphQLResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserObject, {
    name: 'userByEmail',
    description: 'Найти пользователя по email',
    nullable: true,
  })
  async findUserByEmail(
    @Args('email', { description: 'Email пользователя' }) email: string,
  ): Promise<UserObject | null> {
    return this.userService.findByEmail(email);
  }

  @Query(() => UserObject, {
    name: 'user',
    description: 'Получить пользователя по ID',
  })
  async findOneUser(
    @Args('id', { type: () => ID, description: 'ID пользователя' }) id: string,
  ): Promise<UserObject> {
    return this.userService.findOne(id);
  }

  @Mutation(() => Boolean, {
    name: 'removeUser',
    description: 'Удалить пользователя',
  })
  async removeUser(
    @Args('id', { type: () => ID, description: 'ID пользователя' }) id: string,
  ): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }
}
