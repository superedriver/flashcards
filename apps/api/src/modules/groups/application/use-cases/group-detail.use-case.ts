import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { GroupPermissionService } from '../../domain/services/group-permission.service';
import { Group, GroupMember } from '../../domain/types';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type GroupDetailUseCaseInput = {
  currentUser: AuthUser;
  groupId: string;
};

export type GroupDetailUseCaseResult = {
  group: Group;
  myMember: GroupMember;
  members: GroupMember[];
};

@Injectable()
export class GroupDetailUseCase {
  private readonly groupPermissionService = new GroupPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
  ) {}

  async execute(
    input: GroupDetailUseCaseInput,
  ): Promise<GroupDetailUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const group = await this.groupRepository.findById(input.groupId);

    if (!group) {
      throw new ApplicationError(ErrorCodes.GROUP_NOT_FOUND, 'Group not found');
    }

    const myMember = await this.groupRepository.findMember({
      groupId: input.groupId,
      userId: input.currentUser.id,
    });

    if (!this.groupPermissionService.canViewGroup(myMember)) {
      throw new ApplicationError(ErrorCodes.GROUP_FORBIDDEN, 'Group forbidden');
    }

    const members = await this.groupRepository.findMembers(input.groupId);

    return {
      group,
      myMember: myMember!,
      members,
    };
  }
}
