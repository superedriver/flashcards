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
import { CardExamplePromptService } from '../../domain/services/card-example-prompt.service';
import { GeneratedCardExample } from '../../domain/types';
import { AI_PROVIDER, AiProviderPort } from '../ports/ai-provider.port';
import {
  AI_REQUEST_LOG_REPOSITORY,
  AiRequestLogRepositoryPort,
} from '../ports/ai-request-log-repository.port';

export type GenerateCardExamplesUseCaseInput = {
  currentUser: AuthUser;
  cardId: string;
  locale?: string | null;
};

export type GenerateCardExamplesUseCaseResult = {
  cardId: string;
  examples: GeneratedCardExample[];
};

const AI_FEATURE = 'generate-card-examples';

@Injectable()
export class GenerateCardExamplesUseCase {
  private readonly deckPermissionService = new DeckPermissionService();
  private readonly cardExamplePromptService = new CardExamplePromptService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AiProviderPort,
    @Inject(AI_REQUEST_LOG_REPOSITORY)
    private readonly aiRequestLogRepository: AiRequestLogRepositoryPort,
  ) {}

  async execute(
    input: GenerateCardExamplesUseCaseInput,
  ): Promise<GenerateCardExamplesUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const card = await this.cardRepository.findById(input.cardId);

    if (!card) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    const deck = await this.deckRepository.findById(card.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageCard({
      user: input.currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.CARD_FORBIDDEN, 'Card forbidden');
    }

    const promptResult = this.cardExamplePromptService.build({
      front: card.front,
      back: card.back,
      existingExample: card.example,
      notes: card.notes,
      locale: input.locale,
    });

    try {
      const aiResult = await this.aiProvider.generateCardExamples({
        front: card.front,
        back: card.back,
        existingExample: card.example,
        notes: card.notes,
        locale: input.locale,
      });

      await this.aiRequestLogRepository.create({
        userId: input.currentUser.id,
        deckId: deck.id,
        cardId: card.id,
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'SUCCESS',
        promptPreview: promptResult.prompt,
        outputPreview: aiResult.rawOutputPreview,
      });

      return {
        cardId: card.id,
        examples: aiResult.examples,
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApplicationError
          ? error.message
          : 'Failed to generate card examples';

      await this.aiRequestLogRepository.create({
        userId: input.currentUser.id,
        deckId: deck.id,
        cardId: card.id,
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'FAILED',
        promptPreview: promptResult.prompt,
        errorMessage,
      });

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to generate card examples',
      );
    }
  }
}
