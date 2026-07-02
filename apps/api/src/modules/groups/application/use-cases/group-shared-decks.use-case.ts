import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../../../decks/domain/types';
import { GroupPermissionService } from '../../domain/services/group-permission.service';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../ports/deck-group-share-repository.port';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type GroupSharedDecksUseCaseInput = {
  currentUser: AuthUser;
  groupId: string;
};

export type GroupSharedDecksUseCaseResult = Deck[];

@Injectable()
export class GroupSharedDecksUseCase {
  private readonly groupPermissionService = new GroupPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(
    input: GroupSharedDecksUseCaseInput,
  ): Promise<GroupSharedDecksUseCaseResult> {
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

    return this.deckGroupShareRepository.findSharedDecksForGroup(input.groupId);
  }
}
