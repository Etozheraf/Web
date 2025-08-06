import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Redirect,
} from '@nestjs/common';
import { Request } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import {
  createNewSession,
} from 'supertokens-node/recipe/session';
import { AuthGuard } from './guards/auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { PublicAccess } from './decorators/public.decorator';
import Session from 'supertokens-node/recipe/session';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './role.enum'

@PublicAccess()
@Controller('api/auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(
    @Body() signUpDto: SignUpDto,
    @Req() req: Request,
  ) {
    const user = await this.authService.register({ ...signUpDto, role: Role.Admin });
    const recipeUserId = { getAsString: () => user.authId } as any;
    await createNewSession(req, req.res, 'public', recipeUserId);
    return { status: 'success' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() signUpDto: SignUpDto,
    @Req() req: Request,
  ) {
    const user = await this.authService.register({ ...signUpDto, role: Role.User });
    const recipeUserId = { getAsString: () => user.authId } as any;
    await createNewSession(req, req.res, 'public', recipeUserId);
    return { status: 'success' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
  ) {
    const user = await this.authService.login(signInDto);
    const recipeUserId = { getAsString: () => user.authId } as any;
    await createNewSession(req, req.res, 'public', recipeUserId);

    return { user };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Redirect('/')
  async logout(@Req() req: Request) {
    const session = await Session.getSession(req, req.res);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await session.revokeSession();
    return {
      url: '/',
      statusCode: 302,
    };
  }
}