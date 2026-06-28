import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user-repository.port';
import { CreateEmailVerificationTokenUseCase } from './create-email-verification-token.use-case';

export type ResendVerificationEmailInput = {
  userId: string;
};

export type ResendVerificationEmailResult = {
  success: boolean;
};

@Injectable()
export class ResendVerificationEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly createEmailVerificationTokenUseCase: CreateEmailVerificationTokenUseCase,
  ) {}

  async execute(
    input: ResendVerificationEmailInput,
  ): Promise<ResendVerificationEmailResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    if (user.emailVerifiedAt !== null) {
      return { success: true };
    }

    await this.createEmailVerificationTokenUseCase.execute({
      userId: user.id,
      email: user.email,
    });

    return { success: true };
  }
}
