import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { Group } from '../../domain/types';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type CreateGroupUseCaseInput = {
  currentUser: AuthUser;
  name: string;
  description?: string | null;
};

export type CreateGroupUseCaseResult = Group;

const NAME_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
  ) {}

  async execute(
    input: CreateGroupUseCaseInput,
  ): Promise<CreateGroupUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const name = input.name.trim();

    if (!name) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Name is required',
      );
    }

    if (name.length > NAME_MAX_LENGTH) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Name must be at most 120 characters',
      );
    }

    let description: string | null | undefined;
    if (input.description !== undefined) {
      description =
        input.description === null ? null : input.description.trim() || null;

      if (description !== null && description.length > DESCRIPTION_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Description must be at most 1000 characters',
        );
      }
    }

    const group = await this.groupRepository.create({
      name,
      description,
      createdById: input.currentUser.id,
    });

    await this.groupRepository.addMember({
      groupId: group.id,
      userId: input.currentUser.id,
      role: 'OWNER',
    });

    return group;
  }
}
