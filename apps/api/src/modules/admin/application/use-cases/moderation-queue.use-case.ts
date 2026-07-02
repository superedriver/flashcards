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

export type ModerationQueueUseCaseInput = {
  currentUser: AuthUser;
  status?: DeckModerationStatus | null;
  limit?: number;
  offset?: number;
};

export type ModerationQueueUseCaseResult = {
  items: ModerationDeck[];
  total: number;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MIN_LIMIT = 1;
const DEFAULT_OFFSET = 0;

const ALLOWED_STATUSES = new Set<DeckModerationStatus>([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'HIDDEN',
]);

@Injectable()
export class ModerationQueueUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_DECK_REPOSITORY)
    private readonly adminDeckRepository: AdminDeckRepositoryPort,
  ) {}

  async execute(
    input: ModerationQueueUseCaseInput,
  ): Promise<ModerationQueueUseCaseResult> {
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

    const status = this.normalizeStatus(input.status);
    const limit = this.normalizeLimit(input.limit);
    const offset = this.normalizeOffset(input.offset);

    return this.adminDeckRepository.moderationQueue({
      status,
      limit,
      offset,
    });
  }

  private normalizeStatus(
    status?: DeckModerationStatus | null,
  ): DeckModerationStatus | null {
    if (status == null) {
      return null;
    }

    return ALLOWED_STATUSES.has(status) ? status : null;
  }

  private normalizeLimit(limit?: number): number {
    const value = limit ?? DEFAULT_LIMIT;

    return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, value));
  }

  private normalizeOffset(offset?: number): number {
    const value = offset ?? DEFAULT_OFFSET;

    return Math.max(DEFAULT_OFFSET, value);
  }
}
