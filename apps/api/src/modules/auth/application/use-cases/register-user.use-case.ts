import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { CreateEmailVerificationTokenUseCase } from './create-email-verification-token.use-case';

export type RegisterUserInput = {
  email: string;
  password: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type RegisterUserResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(RegisterUserUseCase.name);

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
    private readonly createEmailVerificationTokenUseCase: CreateEmailVerificationTokenUseCase,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    const email = input.email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid email format',
      );
    }

    if (
      input.password.length < PASSWORD_MIN_LENGTH ||
      input.password.length > PASSWORD_MAX_LENGTH
    ) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must be between 8 and 128 characters',
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError(
        ErrorCodes.USER_ALREADY_EXISTS,
        'User with this email already exists',
      );
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({ email, passwordHash });

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

    try {
      await this.createEmailVerificationTokenUseCase.execute({
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(
        'Failed to send verification email after registration',
        error instanceof Error ? error.stack : String(error),
      );
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
