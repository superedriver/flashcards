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

export type RegisterPushTokenUseCaseInput = {
  currentUser: AuthUser;
  token: string;
  deviceId?: string | null;
  platform?: string | null;
};

export type RegisterPushTokenUseCaseResult = {
  success: boolean;
};

const TOKEN_MAX_LENGTH = 500;
const DEVICE_ID_MAX_LENGTH = 200;
const PLATFORM_MAX_LENGTH = 50;

@Injectable()
export class RegisterPushTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokenRepository: PushTokenRepositoryPort,
  ) {}

  async execute(
    input: RegisterPushTokenUseCaseInput,
  ): Promise<RegisterPushTokenUseCaseResult> {
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

    if (token.length > TOKEN_MAX_LENGTH) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Token must be at most 500 characters',
      );
    }

    const deviceId =
      input.deviceId === undefined || input.deviceId === null
        ? null
        : input.deviceId.trim() || null;

    if (deviceId !== null && deviceId.length > DEVICE_ID_MAX_LENGTH) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Device ID must be at most 200 characters',
      );
    }

    const platform =
      input.platform === undefined || input.platform === null
        ? null
        : input.platform.trim() || null;

    if (platform !== null && platform.length > PLATFORM_MAX_LENGTH) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Platform must be at most 50 characters',
      );
    }

    await this.pushTokenRepository.register({
      userId: input.currentUser.id,
      token,
      deviceId,
      platform,
    });

    return { success: true };
  }
}
