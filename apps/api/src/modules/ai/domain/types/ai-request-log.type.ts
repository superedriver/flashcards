import { AiProvider } from './ai-provider.type';
import { AiRequestStatus } from './ai-request-status.type';

export type AiRequestLog = {
  id: string;
  userId: string;
  deckId: string;
  cardId: string;
  provider: AiProvider;
  feature: string;
  status: AiRequestStatus;
  promptPreview: string | null;
  outputPreview: string | null;
  errorMessage: string | null;
  createdAt: Date;
};
