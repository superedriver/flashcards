import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appleSignin from 'apple-signin-auth';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import {
  ACCESS_TOKEN_SERVICE,
  AccessTokenServicePort,
} from '../ports/access-token-service.port';
import {
  BLOCKED_IDENTITY_REPOSITORY,
  BlockedIdentityRepositoryPort,
} from '../ports/blocked-identity-repository.port';
import {
  OAUTH_ACCOUNT_REPOSITORY,
  OAuthAccountRepositoryPort,
} from '../ports/oauth-account-repository.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';
import {
  TOKEN_GENERATOR,
  TokenGeneratorPort,
} from '../ports/token-generator.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user-repository.port';

export type AppleOAuthInput = {
  identityToken: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type AppleOAuthResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
};

const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const APPLE_PROVIDER = 'apple';

@Injectable()
export class AppleOAuthUseCase {
  constructor(
    private readonly config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(BLOCKED_IDENTITY_REPOSITORY)
    private readonly blockedIdentityRepository: BlockedIdentityRepositoryPort,
    @Inject(OAUTH_ACCOUNT_REPOSITORY)
    private readonly oauthAccountRepository: OAuthAccountRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenServicePort,
  ) {}

  async execute(input: AppleOAuthInput): Promise<AppleOAuthResult> {
    const clientId = this.config.get<string>('auth.appleClientId');

    if (!clientId) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Apple Sign In is not configured',
      );
    }

    let appleUserId: string;
    let appleEmail: string | null;

    try {
      const payload = await appleSignin.verifyIdToken(input.identityToken, {
        audience: clientId,
        ignoreExpiration: false,
      });

      if (!payload.sub) {
        throw new Error('Missing sub in Apple token payload');
      }

      appleUserId = payload.sub;
      appleEmail = payload.email ? payload.email.trim().toLowerCase() : null;
    } catch {
      throw new ApplicationError(
        ErrorCodes.UNAUTHORIZED,
        'Invalid Apple identity token',
      );
    }

    if (appleEmail) {
      const isBanned =
        await this.blockedIdentityRepository.existsByEmail(appleEmail);

      if (isBanned) {
        throw new ApplicationError(
          ErrorCodes.UNAUTHORIZED,
          'Account is banned',
        );
      }
    }

    const existingOAuthAccount =
      await this.oauthAccountRepository.findByProviderUid(
        APPLE_PROVIDER,
        appleUserId,
      );

    let user: SafeUser;
    let isNewUser = false;

    if (existingOAuthAccount) {
      const found = await this.userRepository.findById(
        existingOAuthAccount.userId,
      );

      if (!found) {
        throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'User not found');
      }

      if (found.blockedAt) {
        throw new ApplicationError(
          ErrorCodes.UNAUTHORIZED,
          'Account is banned',
        );
      }

      user = found;
    } else {
      if (!appleEmail) {
        // Apple only sends email on first sign-in; subsequent sign-ins omit it.
        // If we don't have an existing account and no email, we cannot create a user.
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Email is required for first-time Apple Sign In',
        );
      }

      const existingUser = await this.userRepository.findByEmail(appleEmail);

      if (existingUser) {
        if (existingUser.blockedAt) {
          throw new ApplicationError(
            ErrorCodes.UNAUTHORIZED,
            'Account is banned',
          );
        }

        user = existingUser;
      } else {
        user = await this.userRepository.createOAuthUser({
          email: appleEmail,
        });
        isNewUser = true;
      }

      await this.oauthAccountRepository.create({
        userId: user.id,
        provider: APPLE_PROVIDER,
        providerUid: appleUserId,
        email: appleEmail,
      });
    }

    const refreshToken = this.tokenGenerator.generateRefreshToken();
    const tokenHash = this.tokenHasher.hash(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    });

    const accessToken = await this.accessTokenService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken, refreshToken, isNewUser };
  }
}
