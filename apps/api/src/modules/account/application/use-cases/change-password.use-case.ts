import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  PASSWORD_HASHER,
  PasswordHasherPort,
} from '../../../auth/application/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_DIGIT_REGEX = /[0-9]/;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const userBase = await this.userRepository.findById(input.userId);

    if (!userBase) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const user = await this.userRepository.findByEmail(userBase.email);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.passwordHash === null) {
      throw new ApplicationError(
        ErrorCodes.FORBIDDEN,
        'Password change is not available for OAuth accounts',
      );
    }

    const isCurrentPasswordValid = await this.passwordHasher.verify(
      user.passwordHash,
      input.currentPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Current password is incorrect',
      );
    }

    if (
      input.newPassword.length < PASSWORD_MIN_LENGTH ||
      input.newPassword.length > PASSWORD_MAX_LENGTH
    ) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must be between 8 and 128 characters',
      );
    }

    if (!PASSWORD_UPPERCASE_REGEX.test(input.newPassword)) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must contain at least one uppercase letter',
      );
    }

    if (!PASSWORD_LOWERCASE_REGEX.test(input.newPassword)) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must contain at least one lowercase letter',
      );
    }

    if (!PASSWORD_DIGIT_REGEX.test(input.newPassword)) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Password must contain at least one digit',
      );
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    await this.userRepository.updatePasswordHash(input.userId, newPasswordHash);
  }
}
