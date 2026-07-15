import { Controller, Post, UseGuards } from '@nestjs/common';
import { InternalJobGuard } from '../../../../common/guards/internal-job.guard';
import { CleanupExpiredDeckPreviewSessionsUseCase } from '../../application/use-cases/cleanup-expired-deck-preview-sessions.use-case';

@Controller('internal/jobs')
export class InternalDeckPreviewController {
  constructor(
    private readonly cleanupExpiredDeckPreviewSessionsUseCase: CleanupExpiredDeckPreviewSessionsUseCase,
  ) {}

  @Post('cleanup-deck-preview-sessions')
  @UseGuards(InternalJobGuard)
  async cleanupDeckPreviewSessions(): Promise<{ deletedCount: number }> {
    return this.cleanupExpiredDeckPreviewSessionsUseCase.execute({
      now: new Date(),
    });
  }
}
