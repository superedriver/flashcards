import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  BLOCKED_IDENTITY_REPOSITORY,
  BlockedIdentityRepositoryPort,
} from '../../../auth/application/ports/blocked-identity-repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';

export type DeleteAccountInput = {
  userId: string;
};

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(BLOCKED_IDENTITY_REPOSITORY)
    private readonly blockedIdentityRepository: BlockedIdentityRepositoryPort,
  ) {}

  async execute(input: DeleteAccountInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      await this.blockedIdentityRepository.upsertByEmail(user.email);
    }

    await this.userRepository.deleteById(input.userId);
  }
}
