import { Module } from '@nestjs/common';
import { CARD_REVIEW_STATE_REPOSITORY } from './application/ports/card-review-state-repository.port';
import { STUDY_SESSION_REPOSITORY } from './application/ports/study-session-repository.port';
import { PrismaCardReviewStateRepository } from './infrastructure/persistence/prisma-card-review-state.repository';
import { PrismaStudySessionRepository } from './infrastructure/persistence/prisma-study-session.repository';

@Module({
  providers: [
    {
      provide: CARD_REVIEW_STATE_REPOSITORY,
      useClass: PrismaCardReviewStateRepository,
    },
    {
      provide: STUDY_SESSION_REPOSITORY,
      useClass: PrismaStudySessionRepository,
    },
  ],
  exports: [CARD_REVIEW_STATE_REPOSITORY, STUDY_SESSION_REPOSITORY],
})
export class LessonsModule {}
