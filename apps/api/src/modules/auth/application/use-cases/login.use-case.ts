import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import {
  ACCESS_TOKEN_SERVICE,
  AccessTokenServicePort,
} from '../ports/access-token-service.port';
import {
  PASSWORD_HASHER,
  PasswordHasherPort,
} from '../ports/password-hasher.port';
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

export type LoginInput = {
  email: string;
  password: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type LoginResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGeneratorPort,
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenServicePort,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase();

    const userRecord = await this.userRepository.findByEmail(email);
    if (!userRecord) {
      throw new ApplicationError(
        ErrorCodes.INVALID_CREDENTIALS,
        INVALID_CREDENTIALS_MESSAGE,
      );
    }

    if (!userRecord.passwordHash) {
      throw new ApplicationError(
        ErrorCodes.INVALID_CREDENTIALS,
        INVALID_CREDENTIALS_MESSAGE,
      );
    }

    if (userRecord.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const passwordValid = await this.passwordHasher.verify(
      userRecord.passwordHash,
      input.password,
    );
    if (!passwordValid) {
      throw new ApplicationError(
        ErrorCodes.INVALID_CREDENTIALS,
        INVALID_CREDENTIALS_MESSAGE,
      );
    }

    const user: SafeUser = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      emailVerifiedAt: userRecord.emailVerifiedAt,
      blockedAt: userRecord.blockedAt,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    };

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

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
