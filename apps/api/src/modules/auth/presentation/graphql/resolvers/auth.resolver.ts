import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationError, ErrorCodes } from '../../../../../common/errors';
import { GetMeUseCase } from '../../../application/use-cases/get-me.use-case';
import { GoogleOAuthUseCase } from '../../../application/use-cases/google-oauth.use-case';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';
import { ResendVerificationEmailUseCase } from '../../../application/use-cases/resend-verification-email.use-case';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../../../application/use-cases/reset-password.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { GoogleOAuthInput } from '../inputs/google-oauth.input';
import { LoginInput } from '../inputs/login.input';
import { LogoutInput } from '../inputs/logout.input';
import { RefreshTokenInput } from '../inputs/refresh-token.input';
import { RegisterInput } from '../inputs/register.input';
import { RequestPasswordResetInput } from '../inputs/request-password-reset.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { VerifyEmailInput } from '../inputs/verify-email.input';
import { AuthPayloadType } from '../types/auth-payload.type';
import { SafeUserType } from '../types/safe-user.type';
import { UserRole } from '../types/user-role.type';
import { AuthUser } from '../../../domain/types';
import { RefreshTokenCookieService } from '../../http/refresh-token-cookie.service';
import type { Request, Response } from 'express';

type AuthGraphqlContext = {
  req: Request;
  res: Response;
};

@Resolver()
export class AuthResolver {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleOAuthUseCase: GoogleOAuthUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationEmailUseCase: ResendVerificationEmailUseCase,
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenCookieService: RefreshTokenCookieService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthPayloadType)
  async register(
    @Args('input') input: RegisterInput,
    @Context() context: AuthGraphqlContext,
  ): Promise<AuthPayloadType> {
    const result = await this.registerUserUseCase.execute(input);

    this.refreshTokenCookieService.setRefreshTokenCookie(
      context.res,
      result.refreshToken,
    );

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthPayloadType)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: AuthGraphqlContext,
  ): Promise<AuthPayloadType> {
    const result = await this.loginUseCase.execute(input);

    this.refreshTokenCookieService.setRefreshTokenCookie(
      context.res,
      result.refreshToken,
    );

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => AuthPayloadType)
  async googleAuth(
    @Args('input') input: GoogleOAuthInput,
    @Context() context: AuthGraphqlContext,
  ): Promise<AuthPayloadType> {
    const result = await this.googleOAuthUseCase.execute({
      idToken: input.idToken,
      userAgent: context.req.headers['user-agent'] ?? null,
      ipAddress: context.req.ip ?? null,
    });

    this.refreshTokenCookieService.setRefreshTokenCookie(
      context.res,
      result.refreshToken,
    );

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
    @Context() context: AuthGraphqlContext,
  ): Promise<AuthPayloadType> {
    const refreshToken = this.resolveRefreshToken(
      input.refreshToken,
      context.req,
    );
    const result = await this.refreshTokenUseCase.execute({ refreshToken });

    this.refreshTokenCookieService.setRefreshTokenCookie(
      context.res,
      result.refreshToken,
    );

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
  async logout(
    @Args('input') input: LogoutInput,
    @Context() context: AuthGraphqlContext,
  ): Promise<boolean> {
    const refreshToken =
      input.refreshToken?.trim() ||
      this.refreshTokenCookieService.getRefreshTokenFromRequest(context.req);

    if (refreshToken) {
      const result = await this.logoutUseCase.execute({ refreshToken });
      this.refreshTokenCookieService.clearRefreshTokenCookie(context.res);

      return result.success;
    }

    this.refreshTokenCookieService.clearRefreshTokenCookie(context.res);

    return true;
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

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<boolean> {
    const result = await this.requestPasswordResetUseCase.execute(input);

    return result.success;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<boolean> {
    const result = await this.resetPasswordUseCase.execute(input);

    return result.success;
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

  private resolveRefreshToken(
    inputRefreshToken: string | undefined,
    req: Request,
  ): string {
    const refreshToken =
      inputRefreshToken?.trim() ||
      this.refreshTokenCookieService.getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    return refreshToken;
  }
}
