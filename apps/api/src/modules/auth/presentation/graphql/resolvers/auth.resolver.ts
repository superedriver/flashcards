import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetMeUseCase } from '../../../application/use-cases/get-me.use-case';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';
import { ResendVerificationEmailUseCase } from '../../../application/use-cases/resend-verification-email.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { LoginInput } from '../inputs/login.input';
import { LogoutInput } from '../inputs/logout.input';
import { RefreshTokenInput } from '../inputs/refresh-token.input';
import { RegisterInput } from '../inputs/register.input';
import { VerifyEmailInput } from '../inputs/verify-email.input';
import { AuthPayloadType } from '../types/auth-payload.type';
import { SafeUserType } from '../types/safe-user.type';
import { UserRole } from '../types/user-role.type';
import { AuthUser } from '../../../domain/types';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationEmailUseCase: ResendVerificationEmailUseCase,
  ) {}

  @Mutation(() => AuthPayloadType)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayloadType> {
    const result = await this.registerUserUseCase.execute(input);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }

  @Mutation(() => AuthPayloadType)
  async login(@Args('input') input: LoginInput): Promise<AuthPayloadType> {
    const result = await this.loginUseCase.execute(input);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }

  @Mutation(() => AuthPayloadType)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<AuthPayloadType> {
    const result = await this.refreshTokenUseCase.execute(input);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }

  @Mutation(() => Boolean)
  async logout(@Args('input') input: LogoutInput): Promise<boolean> {
    const result = await this.logoutUseCase.execute(input);
    return result.success;
  }

  @Mutation(() => SafeUserType)
  async verifyEmail(
    @Args('input') input: VerifyEmailInput,
  ): Promise<SafeUserType> {
    const user = await this.verifyEmailUseCase.execute(input);

    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async resendVerificationEmail(
    @CurrentUser() user: AuthUser,
  ): Promise<boolean> {
    const result = await this.resendVerificationEmailUseCase.execute({
      userId: user.id,
    });

    return result.success;
  }

  @Query(() => SafeUserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: AuthUser): Promise<SafeUserType> {
    const safeUser = await this.getMeUseCase.execute(user);

    return {
      ...safeUser,
      role: safeUser.role as UserRole,
    };
  }
}
