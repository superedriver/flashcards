import { AiProvider, AiRequestLog, AiRequestStatus } from '../../domain/types';

type PrismaAiRequestLogRecord = {
  id: string;
  userId: string;
  deckId: string;
  cardId: string;
  provider: string;
  feature: string;
  status: string;
  promptPreview: string | null;
  outputPreview: string | null;
  errorMessage: string | null;
  createdAt: Date;
};

export function toAiRequestLog(record: PrismaAiRequestLogRecord): AiRequestLog {
  return {
    id: record.id,
    userId: record.userId,
    deckId: record.deckId,
    cardId: record.cardId,
    provider: record.provider as AiProvider,
    feature: record.feature,
    status: record.status as AiRequestStatus,
    promptPreview: record.promptPreview,
    outputPreview: record.outputPreview,
    errorMessage: record.errorMessage,
    createdAt: record.createdAt,
  };
}

export function truncateLogText(
  value: string | null | undefined,
  maxLength: number,
): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.slice(0, maxLength);
}

export const PROMPT_PREVIEW_MAX_LENGTH = 500;
export const OUTPUT_PREVIEW_MAX_LENGTH = 1000;
export const ERROR_MESSAGE_MAX_LENGTH = 1000;
