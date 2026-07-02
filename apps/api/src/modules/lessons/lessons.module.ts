import { Module } from '@nestjs/common';
import { CARD_REVIEW_STATE_REPOSITORY } from './application/ports/card-review-state-repository.port';
import { PrismaCardReviewStateRepository } from './infrastructure/persistence/prisma-card-review-state.repository';

@Module({
  providers: [
    {
      provide: CARD_REVIEW_STATE_REPOSITORY,
      useClass: PrismaCardReviewStateRepository,
    },
  ],
  exports: [CARD_REVIEW_STATE_REPOSITORY],
})
export class LessonsModule {}
