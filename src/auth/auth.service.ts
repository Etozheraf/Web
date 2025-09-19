import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { SignInDto } from './dto/sign-in.dto';
import { RolesService } from './roles.service';
import { Role as PrismaRole, User } from '@prisma/client';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    const { email, password, name, role } = signUpDto;
    const prismaRole = role === Role.Admin ? PrismaRole.ADMIN : PrismaRole.USER;

    const supeTokensResponse = await EmailPassword.signUp(
      'public',
      email,
      password,
    );

    if (supeTokensResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      throw new ConflictException('Email already exists');
    }

    const authId = supeTokensResponse.user.id;
    const localUser = await this.userService.create({
      authId,
      email,
      name,
      role: prismaRole,
    });

    await this.rolesService.addRoleToUser(authId, signUpDto.role);

    return localUser;
  }

  async login(
    signInDto: SignInDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password } = signInDto;
    const response = await EmailPassword.signIn('public', email, password);

    if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      throw new UnauthorizedException('Wrong credentials');
    }

    const user = await this.userService.findByAuthId(response.user.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
