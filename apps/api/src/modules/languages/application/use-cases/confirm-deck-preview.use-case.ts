import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../../../decks/application/ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { Card, Deck } from '../../../decks/domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../../../lessons/application/ports/card-review-state-repository.port';
import {
  USER_STUDY_LANGUAGE_REPOSITORY,
  UserStudyLanguageRepositoryPort,
} from '../ports/user-study-language-repository.port';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type ConfirmDeckPreviewUseCaseInput = {
  currentUser: AuthUser;
  sessionId: string;
  now?: Date;
};

export type ConfirmDeckPreviewUseCaseResult = {
  deck: Deck;
  cards: Card[];
};

@Injectable()
export class ConfirmDeckPreviewUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
    @Inject(USER_STUDY_LANGUAGE_REPOSITORY)
    private readonly userStudyLanguageRepository: UserStudyLanguageRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
  ) {}

  async execute(
    input: ConfirmDeckPreviewUseCaseInput,
  ): Promise<ConfirmDeckPreviewUseCaseResult> {
    await this.ensureActiveUser(input.currentUser.id);
    const now = input.now ?? new Date();

    const session = await this.deckPreviewSessionRepository.findById(
      input.sessionId,
    );

    if (!session || session.userId !== input.currentUser.id) {
      throw new ApplicationError(
        ErrorCodes.PREVIEW_SESSION_NOT_FOUND,
        'Preview session not found',
      );
    }

    if (session.status !== 'READY' || session.expiresAt <= now) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Preview session is not ready',
      );
    }

    if (!session.sourceDeckId) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Preview session is missing source deck',
      );
    }

    if (session.type === 'REGENERATE_DECK') {
      return this.confirmRegenerate(input.currentUser, session);
    }

    return this.confirmCopy(input.currentUser, session);
  }

  private async confirmCopy(
    currentUser: AuthUser,
    session: {
      id: string;
      sourceDeckId: string | null;
      targetLanguage: string;
      chosenSourceLanguage: string;
      cards: Array<{
        front: string;
        back: string;
        example: string | null;
      }>;
    },
  ): Promise<ConfirmDeckPreviewUseCaseResult> {
    const sourceDeck = await this.deckRepository.findById(
      session.sourceDeckId!,
    );

    if (!sourceDeck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const copiedDeck = await this.deckRepository.createCopiedDeck({
      ownerId: currentUser.id,
      title: sourceDeck.title,
      description: sourceDeck.description,
    });

    const deck = await this.deckRepository.update({
      deckId: copiedDeck.id,
      targetLanguage: session.targetLanguage,
      sourceLanguage: session.chosenSourceLanguage,
    });

    const cards =
      session.cards.length > 0
        ? await this.cardRepository.createMany({
            cards: session.cards.map((card, index) => ({
              deckId: deck.id,
              front: card.front,
              back: card.back,
              example: card.example,
              notes: null,
              position: index,
            })),
          })
        : [];

    if (cards.length > 0) {
      await this.cardReviewStateRepository.createInitialMany({
        userId: deck.ownerId,
        cardIds: cards.map((card) => card.id),
      });
    }

    await this.userStudyLanguageRepository.upsert(
      currentUser.id,
      session.targetLanguage,
    );

    await this.deckPreviewSessionRepository.delete(session.id);

    return { deck, cards };
  }

  private async confirmRegenerate(
    currentUser: AuthUser,
    session: {
      id: string;
      sourceDeckId: string | null;
      chosenSourceLanguage: string;
      cards: Array<{
        sourceCardId?: string;
        front: string;
        back: string;
        example: string | null;
      }>;
    },
  ): Promise<ConfirmDeckPreviewUseCaseResult> {
    const deck = await this.deckRepository.findById(session.sourceDeckId!);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageDeck({
      user: currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    const updatedDeck = await this.deckRepository.update({
      deckId: deck.id,
      sourceLanguage: session.chosenSourceLanguage,
    });

    const updatedCards: Card[] = [];

    for (const previewCard of session.cards) {
      if (!previewCard.sourceCardId) {
        continue;
      }

      const updated = await this.cardRepository.update({
        cardId: previewCard.sourceCardId,
        back: previewCard.back,
        example: previewCard.example,
      });
      updatedCards.push(updated);
    }

    await this.deckPreviewSessionRepository.delete(session.id);

    return {
      deck: updatedDeck,
      cards: updatedCards,
    };
  }

  private async ensureActiveUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }
  }
}
