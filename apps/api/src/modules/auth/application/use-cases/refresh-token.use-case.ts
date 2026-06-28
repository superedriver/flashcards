import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import {
  ACCESS_TOKEN_SERVICE,
  AccessTokenServicePort,
} from '../ports/access-token-service.port';
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

export type RefreshTokenInput = {
  refreshToken: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type RefreshTokenResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

const UNAUTHORIZED_MESSAGE = 'Unauthorized';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenServicePort,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    const tokenHash = this.tokenHasher.hash(input.refreshToken);
    const activeToken =
      await this.refreshTokenRepository.findActiveByHash(tokenHash);

    if (!activeToken) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, UNAUTHORIZED_MESSAGE);
    }

    const user = await this.userRepository.findById(activeToken.userId);
    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, UNAUTHORIZED_MESSAGE);
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    await this.refreshTokenRepository.revokeById(activeToken.id);

    const refreshToken = this.tokenGenerator.generateRefreshToken();
    const newTokenHash = this.tokenHasher.hash(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt,
      rotatedFromTokenId: activeToken.id,
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    });

    const accessToken = await this.accessTokenService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
