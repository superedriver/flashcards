import { AiProvider, AiRequestLog, AiRequestStatus } from '../../domain/types';

export const AI_REQUEST_LOG_REPOSITORY = Symbol('AI_REQUEST_LOG_REPOSITORY');

export type CreateAiRequestLogInput = {
  userId: string;
  deckId: string;
  cardId: string;
  provider: AiProvider;
  feature: string;
  status: AiRequestStatus;
  promptPreview?: string | null;
  outputPreview?: string | null;
  errorMessage?: string | null;
};

export type AiRequestLogRepositoryPort = {
  create(input: CreateAiRequestLogInput): Promise<AiRequestLog>;
};
