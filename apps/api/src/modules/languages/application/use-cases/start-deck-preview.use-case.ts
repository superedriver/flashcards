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
import { Deck } from '../../../decks/domain/types';
import {
  DECK_GROUP_SHARE_REPOSITORY,
  DeckGroupShareRepositoryPort,
} from '../../../groups/application/ports/deck-group-share-repository.port';
import { GeneratePreviewExampleUseCase } from '../../../ai/application/use-cases/generate-preview-example.use-case';
import { TranslateCardBackUseCase } from '../../../ai/application/use-cases/translate-card-back.use-case';
import {
  DECK_PREVIEW_SESSION_TTL_MS,
  DeckPreviewSession,
  DeckPreviewSessionCard,
  DeckPreviewSessionType,
} from '../../domain/types';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type StartDeckPreviewUseCaseInput = {
  currentUser: AuthUser;
  type: DeckPreviewSessionType;
  sourceDeckId: string;
  chosenSourceLanguage: string;
  discardActive?: boolean;
  now?: Date;
};

export type StartDeckPreviewUseCaseResult = DeckPreviewSession;

@Injectable()
export class StartDeckPreviewUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_GROUP_SHARE_REPOSITORY)
    private readonly deckGroupShareRepository: DeckGroupShareRepositoryPort,
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
    private readonly translateCardBackUseCase: TranslateCardBackUseCase,
    private readonly generatePreviewExampleUseCase: GeneratePreviewExampleUseCase,
  ) {}

  async execute(
    input: StartDeckPreviewUseCaseInput,
  ): Promise<StartDeckPreviewUseCaseResult> {
    const now = input.now ?? new Date();
    await this.ensureActiveUser(input.currentUser.id);

    const chosenSourceLanguage = input.chosenSourceLanguage.trim();
    if (!chosenSourceLanguage) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Source language is required',
      );
    }

    const sourceDeck = await this.loadSourceDeck(input);
    const targetLanguage = sourceDeck.targetLanguage;

    if (!targetLanguage) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Source deck must have a target language',
      );
    }

    if (
      (input.type === 'COPY_PUBLIC' || input.type === 'COPY_GROUP') &&
      sourceDeck.sourceLanguage === chosenSourceLanguage
    ) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Use one-to-one copy when source language is unchanged',
      );
    }

    const activeSession =
      await this.deckPreviewSessionRepository.findActiveByUserId(
        input.currentUser.id,
        now,
      );

    if (activeSession) {
      if (!input.discardActive) {
        throw new ApplicationError(
          ErrorCodes.PREVIEW_SESSION_ACTIVE,
          'An active preview session already exists',
        );
      }

      await this.deckPreviewSessionRepository.delete(activeSession.id);
    }

    const sourceCards = await this.cardRepository.findByDeckId(sourceDeck.id);
    const initialCards: DeckPreviewSessionCard[] = sourceCards.map((card) => ({
      sourceCardId: card.id,
      front: card.front,
      back: '',
      example: null,
    }));

    let session = await this.deckPreviewSessionRepository.create({
      userId: input.currentUser.id,
      type: input.type,
      sourceDeckId: sourceDeck.id,
      targetLanguage,
      chosenSourceLanguage,
      cards: initialCards,
      expiresAt: new Date(now.getTime() + DECK_PREVIEW_SESSION_TTL_MS),
    });

    const generatedCards: DeckPreviewSessionCard[] = [];

    for (const card of initialCards) {
      const translated = await this.translateCardBackUseCase.execute({
        currentUserId: input.currentUser.id,
        front: card.front,
        targetLanguage,
        sourceLanguage: chosenSourceLanguage,
        deckId: sourceDeck.id,
        cardId: card.sourceCardId ?? sourceDeck.id,
      });

      const back = translated.back ?? '';
      const backError = translated.error ?? undefined;

      const exampleResult =
        back.length > 0
          ? await this.generatePreviewExampleUseCase.execute({
              currentUserId: input.currentUser.id,
              front: card.front,
              back,
              targetLanguage,
              sourceLanguage: chosenSourceLanguage,
              deckId: sourceDeck.id,
              cardId: card.sourceCardId ?? sourceDeck.id,
            })
          : { example: null, error: backError ? null : 'Back is empty' };

      generatedCards.push({
        sourceCardId: card.sourceCardId,
        front: card.front,
        back,
        example: exampleResult.example,
        ...(backError ? { backError } : {}),
        ...(exampleResult.error ? { exampleError: exampleResult.error } : {}),
      });

      session = await this.deckPreviewSessionRepository.updateCards({
        sessionId: session.id,
        cards: [
          ...generatedCards,
          ...initialCards.slice(generatedCards.length),
        ],
      });
    }

    return this.deckPreviewSessionRepository.updateStatus({
      sessionId: session.id,
      status: 'READY',
    });
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

  private async loadSourceDeck(
    input: StartDeckPreviewUseCaseInput,
  ): Promise<Deck> {
    if (input.type === 'COPY_PUBLIC') {
      const deck = await this.deckRepository.findPublicApprovedById(
        input.sourceDeckId,
      );

      if (!deck) {
        throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
      }

      return deck;
    }

    const deck = await this.deckRepository.findById(input.sourceDeckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    if (input.type === 'REGENERATE_DECK') {
      const canManage = this.deckPermissionService.canManageDeck({
        user: input.currentUser,
        deck,
      });

      if (!canManage) {
        throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
      }

      return deck;
    }

    const hasAccess = await this.deckGroupShareRepository.userHasAccessToDeck({
      userId: input.currentUser.id,
      deckId: deck.id,
    });

    if (!hasAccess) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    return deck;
  }
}
