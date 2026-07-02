import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { GroupPermissionService } from '../../domain/services/group-permission.service';
import { DeckGroupShare } from '../../domain/types';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../ports/deck-group-share-repository.port';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type ShareDeckWithGroupUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  groupId: string;
};

export type ShareDeckWithGroupUseCaseResult = DeckGroupShare;

@Injectable()
export class ShareDeckWithGroupUseCase {
  private readonly deckPermissionService = new DeckPermissionService();
  private readonly groupPermissionService = new GroupPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
  ) {}

  async execute(
    input: ShareDeckWithGroupUseCaseInput,
  ): Promise<ShareDeckWithGroupUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageDeck({
      user: input.currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    const group = await this.groupRepository.findById(input.groupId);

    if (!group) {
      throw new ApplicationError(ErrorCodes.GROUP_NOT_FOUND, 'Group not found');
    }

    const myMember = await this.groupRepository.findMember({
      groupId: input.groupId,
      userId: input.currentUser.id,
    });

    if (!this.groupPermissionService.canShareDeckWithGroup(myMember)) {
      throw new ApplicationError(ErrorCodes.GROUP_FORBIDDEN, 'Group forbidden');
    }

    const existingShare =
      await this.deckGroupShareRepository.findByDeckAndGroup({
        deckId: input.deckId,
        groupId: input.groupId,
      });

    if (existingShare && existingShare.deletedAt === null) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Deck is already shared with this group',
      );
    }

    return this.deckGroupShareRepository.create({
      deckId: input.deckId,
      groupId: input.groupId,
      createdById: input.currentUser.id,
    });
  }
}
