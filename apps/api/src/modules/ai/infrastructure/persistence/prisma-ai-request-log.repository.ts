import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  AiRequestLogRepositoryPort,
  CreateAiRequestLogInput,
} from '../../application/ports/ai-request-log-repository.port';
import { AiRequestLog } from '../../domain/types';
import {
  ERROR_MESSAGE_MAX_LENGTH,
  OUTPUT_PREVIEW_MAX_LENGTH,
  PROMPT_PREVIEW_MAX_LENGTH,
  toAiRequestLog,
  truncateLogText,
} from '../mappers/ai-request-log.mapper';

@Injectable()
export class PrismaAiRequestLogRepository implements AiRequestLogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAiRequestLogInput): Promise<AiRequestLog> {
    const record = await this.prisma.aiRequestLog.create({
      data: {
        userId: input.userId,
        deckId: input.deckId,
        cardId: input.cardId,
        provider: input.provider,
        feature: input.feature,
        status: input.status,
        promptPreview: truncateLogText(
          input.promptPreview,
          PROMPT_PREVIEW_MAX_LENGTH,
        ),
        outputPreview: truncateLogText(
          input.outputPreview,
          OUTPUT_PREVIEW_MAX_LENGTH,
        ),
        errorMessage: truncateLogText(
          input.errorMessage,
          ERROR_MESSAGE_MAX_LENGTH,
        ),
      },
    });

    return toAiRequestLog(record);
  }
}
