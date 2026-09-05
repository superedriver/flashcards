import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { DeckPermissionService } from '../../domain/services/deck-permission.service';
import {
  BULK_CARD_MAX_VALID_ROWS,
  normalizeCardPair,
} from '../../domain/services/normalize-card-pair';
import {
  CARD_REPOSITORY,
  CardPairInput,
  CardRepositoryPort,
  LiveDuplicateCard,
} from '../ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

export type CardDuplicateKind = 'CURRENT_DECK' | 'OTHER_DECK' | 'IN_BATCH';

export type CheckCardDuplicatesUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  pairs: CardPairInput[];
};

export type CheckCardDuplicateHit = {
  index: number;
  kind: CardDuplicateKind;
  deckTitle: string | null;
};

export type CheckCardDuplicatesUseCaseResult = {
  hits: CheckCardDuplicateHit[];
};

function pairKey(front: string, back: string): string {
  const normalized = normalizeCardPair(front, back);

  return `${normalized.front}\0${normalized.back}`;
}

function classifyDbHit(
  matches: LiveDuplicateCard[],
  currentDeckId: string,
): { kind: CardDuplicateKind; deckTitle: string | null } | null {
  if (matches.some((match) => match.deckId === currentDeckId)) {
    return {
      kind: 'CURRENT_DECK',
      deckTitle: null,
    };
  }

  const otherDeckMatch = matches[0];

  if (otherDeckMatch) {
    return {
      kind: 'OTHER_DECK',
      deckTitle: otherDeckMatch.deckTitle,
    };
  }

  return null;
}

@Injectable()
export class CheckCardDuplicatesUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
  ) {}

  async execute(
    input: CheckCardDuplicatesUseCaseInput,
  ): Promise<CheckCardDuplicatesUseCaseResult> {
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

    const canCreate = this.deckPermissionService.canCreateCard({
      user: input.currentUser,
      deck,
    });

    if (!canCreate) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    if (input.pairs.length > BULK_CARD_MAX_VALID_ROWS) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'At most 100 pairs',
      );
    }

    if (input.pairs.length === 0) {
      return { hits: [] };
    }

    const firstIndexByKey = new Map<string, number>();

    for (const [index, pair] of input.pairs.entries()) {
      const key = pairKey(pair.front, pair.back);

      if (!firstIndexByKey.has(key)) {
        firstIndexByKey.set(key, index);
      }
    }

    const liveDuplicates = await this.cardRepository.findLiveDuplicatesForOwner(
      {
        ownerId: input.currentUser.id,
        pairs: input.pairs,
      },
    );

    const dbHitsByKey = new Map<string, LiveDuplicateCard[]>();

    for (const duplicate of liveDuplicates) {
      const key = pairKey(duplicate.front, duplicate.back);
      const existing = dbHitsByKey.get(key);

      if (existing) {
        existing.push(duplicate);
      } else {
        dbHitsByKey.set(key, [duplicate]);
      }
    }

    const hits: CheckCardDuplicateHit[] = [];

    for (const [index, pair] of input.pairs.entries()) {
      const key = pairKey(pair.front, pair.back);
      const dbHit = classifyDbHit(dbHitsByKey.get(key) ?? [], input.deckId);

      if (dbHit) {
        hits.push({
          index,
          kind: dbHit.kind,
          deckTitle: dbHit.deckTitle,
        });
        continue;
      }

      const firstIndex = firstIndexByKey.get(key);

      if (firstIndex !== undefined && firstIndex < index) {
        hits.push({
          index,
          kind: 'IN_BATCH',
          deckTitle: null,
        });
      }
    }

    return { hits };
  }
}
