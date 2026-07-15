import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { logAiRequestSummary } from '../../../../common/observability';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { TranslateCardBackPromptService } from '../../domain/services/translate-card-back-prompt.service';
import { AI_PROVIDER, AiProviderPort } from '../ports/ai-provider.port';
import {
  AI_REQUEST_LOG_REPOSITORY,
  AiRequestLogRepositoryPort,
} from '../ports/ai-request-log-repository.port';

export type TranslateCardBackUseCaseInput = {
  currentUserId: string;
  front: string;
  targetLanguage: string;
  sourceLanguage: string;
  deckId: string;
  cardId: string;
};

export type TranslateCardBackUseCaseResult = {
  back: string | null;
  error: string | null;
};

const AI_FEATURE = 'translate-card-back';

@Injectable()
export class TranslateCardBackUseCase {
  private readonly translateCardBackPromptService =
    new TranslateCardBackPromptService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AiProviderPort,
    @Inject(AI_REQUEST_LOG_REPOSITORY)
    private readonly aiRequestLogRepository: AiRequestLogRepositoryPort,
  ) {}

  async execute(
    input: TranslateCardBackUseCaseInput,
  ): Promise<TranslateCardBackUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUserId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const front = input.front.trim();
    const targetLanguage = input.targetLanguage.trim();
    const sourceLanguage = input.sourceLanguage.trim();

    if (!front) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Front text is required',
      );
    }

    if (!targetLanguage || !sourceLanguage) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Target and source language are required',
      );
    }

    const promptResult = this.translateCardBackPromptService.build({
      front,
      targetLanguage,
      sourceLanguage,
    });

    try {
      const aiResult = await this.aiProvider.translateCardBack({
        front,
        targetLanguage,
        sourceLanguage,
      });

      await this.aiRequestLogRepository.create({
        userId: input.currentUserId,
        deckId: input.deckId,
        cardId: input.cardId,
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'SUCCESS',
        promptPreview: promptResult.prompt,
        outputPreview: aiResult.rawOutputPreview,
      });

      logAiRequestSummary({
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'SUCCESS',
        cardId: input.cardId,
      });

      return {
        back: aiResult.back,
        error: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof ApplicationError
          ? error.message
          : 'Failed to translate card back';

      await this.aiRequestLogRepository.create({
        userId: input.currentUserId,
        deckId: input.deckId,
        cardId: input.cardId,
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'FAILED',
        promptPreview: promptResult.prompt,
        errorMessage,
      });

      logAiRequestSummary({
        provider: this.aiProvider.providerName,
        feature: AI_FEATURE,
        status: 'FAILED',
        cardId: input.cardId,
        errorMessage,
      });

      return {
        back: null,
        error: errorMessage,
      };
    }
  }
}
