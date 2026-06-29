import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { UserProfile } from '../../domain/types';
import {
  USER_PROFILE_REPOSITORY,
  UserProfileRepositoryPort,
} from '../ports/user-profile-repository.port';

export type UpdateProfileInput = {
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

export type UpdateProfileResult = UserProfile;

const DISPLAY_NAME_MAX_LENGTH = 80;
const AVATAR_URL_MAX_LENGTH = 500;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(input: UpdateProfileInput): Promise<UpdateProfileResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const updateData: {
      displayName?: string | null;
      avatarUrl?: string | null;
    } = {};

    if (input.displayName !== undefined) {
      const displayName =
        input.displayName === null ? null : input.displayName.trim() || null;

      if (
        displayName !== null &&
        displayName.length > DISPLAY_NAME_MAX_LENGTH
      ) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Display name must be at most 80 characters',
        );
      }

      updateData.displayName = displayName;
    }

    if (input.avatarUrl !== undefined) {
      const avatarUrl =
        input.avatarUrl === null ? null : input.avatarUrl.trim() || null;

      if (avatarUrl !== null) {
        if (avatarUrl.length > AVATAR_URL_MAX_LENGTH) {
          throw new ApplicationError(
            ErrorCodes.VALIDATION_ERROR,
            'Avatar URL must be at most 500 characters',
          );
        }

        if (!isValidUrl(avatarUrl)) {
          throw new ApplicationError(
            ErrorCodes.VALIDATION_ERROR,
            'Invalid avatar URL',
          );
        }
      }

      updateData.avatarUrl = avatarUrl;
    }

    const existingProfile = await this.userProfileRepository.findByUserId(
      input.userId,
    );
    if (!existingProfile) {
      await this.userProfileRepository.createForUser(input.userId);
    }

    return this.userProfileRepository.update({
      userId: input.userId,
      ...updateData,
    });
  }
}
