import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
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

export type GoogleOAuthInput = {
  idToken: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type GoogleOAuthResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
};

const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const GOOGLE_PROVIDER = 'google';

@Injectable()
export class GoogleOAuthUseCase {
  private readonly googleClient: OAuth2Client;

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
  ) {
    const clientId = this.config.get<string>('auth.googleClientId') ?? '';
    this.googleClient = new OAuth2Client(clientId);
  }

  async execute(input: GoogleOAuthInput): Promise<GoogleOAuthResult> {
    const clientId = this.config.get<string>('auth.googleClientId');

    if (!clientId) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Google OAuth is not configured',
      );
    }

    let googleUserId: string;
    let googleEmail: string;

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: input.idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email) {
        throw new Error('Missing sub or email in Google token payload');
      }

      googleUserId = payload.sub;
      googleEmail = payload.email.trim().toLowerCase();
    } catch {
      throw new ApplicationError(
        ErrorCodes.UNAUTHORIZED,
        'Invalid Google token',
      );
    }

    const isBanned =
      await this.blockedIdentityRepository.existsByEmail(googleEmail);

    if (isBanned) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Account is banned');
    }

    const existingOAuthAccount =
      await this.oauthAccountRepository.findByProviderUid(
        GOOGLE_PROVIDER,
        googleUserId,
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
      const existingUser = await this.userRepository.findByEmail(googleEmail);

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
          email: googleEmail,
        });
        isNewUser = true;
      }

      await this.oauthAccountRepository.create({
        userId: user.id,
        provider: GOOGLE_PROVIDER,
        providerUid: googleUserId,
        email: googleEmail,
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
