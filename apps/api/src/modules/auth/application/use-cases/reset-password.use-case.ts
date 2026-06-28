import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  PASSWORD_HASHER,
  PasswordHasherPort,
} from '../ports/password-hasher.port';
import {
  PASSWORD_RESET_TOKEN_REPOSITORY,
  PasswordResetTokenRepositoryPort,
} from '../ports/password-reset-token-repository.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user-repository.port';

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResult = {
  success: boolean;
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const INVALID_PASSWORD_RESET_TOKEN_MESSAGE =
  'Invalid or expired password reset token';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly passwordResetTokenRepository: PasswordResetTokenRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordResult> {
    if (
      input.newPassword.length < PASSWORD_MIN_LENGTH ||
      input.newPassword.length > PASSWORD_MAX_LENGTH
    ) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must be between 8 and 128 characters',
      );
    }

    const tokenHash = this.tokenHasher.hash(input.token);
    const resetToken =
      await this.passwordResetTokenRepository.findValidByHash(tokenHash);

    if (!resetToken) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        INVALID_PASSWORD_RESET_TOKEN_MESSAGE,
      );
    }

    const passwordHash = await this.passwordHasher.hash(input.newPassword);

    await this.userRepository.updatePasswordHash(
      resetToken.userId,
      passwordHash,
    );
    await this.passwordResetTokenRepository.markUsed(resetToken.id);
    await this.refreshTokenRepository.revokeAllForUser(resetToken.userId);

    return { success: true };
  }
}
