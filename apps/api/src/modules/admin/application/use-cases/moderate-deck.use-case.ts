import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { DeckModerationStatus } from '../../../decks/domain/types';
import { AdminPermissionService } from '../../domain/services/admin-permission.service';
import { ModerationDeck } from '../../domain/types';
import {
  ADMIN_DECK_REPOSITORY,
  AdminDeckRepositoryPort,
} from '../ports/admin-deck-repository.port';

export type ModerateDeckAction = 'APPROVE' | 'REJECT' | 'HIDE';

export type ModerateDeckUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  action: ModerateDeckAction;
};

export type ModerateDeckUseCaseResult = ModerationDeck;

const ACTION_TO_STATUS: Record<ModerateDeckAction, DeckModerationStatus> = {
  APPROVE: 'APPROVED',
  REJECT: 'REJECTED',
  HIDE: 'HIDDEN',
};

@Injectable()
export class ModerateDeckUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_DECK_REPOSITORY)
    private readonly adminDeckRepository: AdminDeckRepositoryPort,
  ) {}

  async execute(
    input: ModerateDeckUseCaseInput,
  ): Promise<ModerateDeckUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    if (!this.adminPermissionService.canModerateDecks(input.currentUser)) {
      throw new ApplicationError(ErrorCodes.FORBIDDEN, 'Forbidden');
    }

    try {
      return await this.adminDeckRepository.setModerationStatus({
        deckId: input.deckId,
        status: ACTION_TO_STATUS[input.action],
      });
    } catch {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }
  }
}
