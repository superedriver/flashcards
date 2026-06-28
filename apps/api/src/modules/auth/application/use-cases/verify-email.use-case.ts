import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import {
  EMAIL_VERIFICATION_TOKEN_REPOSITORY,
  EmailVerificationTokenRepositoryPort,
} from '../ports/email-verification-token-repository.port';
import { TOKEN_HASHER, TokenHasherPort } from '../ports/token-hasher.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user-repository.port';

export type VerifyEmailInput = {
  token: string;
};

const INVALID_VERIFICATION_TOKEN_MESSAGE =
  'Invalid or expired verification token';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: TokenHasherPort,
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: VerifyEmailInput): Promise<SafeUser> {
    const tokenHash = this.tokenHasher.hash(input.token);
    const verificationToken =
      await this.emailVerificationTokenRepository.findValidByHash(tokenHash);

    if (!verificationToken) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        INVALID_VERIFICATION_TOKEN_MESSAGE,
      );
    }

    const verifiedAt = new Date();
    const user = await this.userRepository.markEmailVerified(
      verificationToken.userId,
      verifiedAt,
    );

    await this.emailVerificationTokenRepository.markUsed(verificationToken.id);

    return user;
  }
}
