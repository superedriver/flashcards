import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  PUSH_TOKEN_REPOSITORY,
  PushTokenRepositoryPort,
} from '../ports/push-token-repository.port';

export type RemovePushTokenUseCaseInput = {
  currentUser: AuthUser;
  token: string;
};

export type RemovePushTokenUseCaseResult = {
  success: boolean;
};

@Injectable()
export class RemovePushTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokenRepository: PushTokenRepositoryPort,
  ) {}

  async execute(
    input: RemovePushTokenUseCaseInput,
  ): Promise<RemovePushTokenUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const token = input.token.trim();

    if (!token) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Token is required',
      );
    }

    await this.pushTokenRepository.disable({
      userId: input.currentUser.id,
      token,
    });

    return { success: true };
  }
}
