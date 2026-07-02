import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { DecksModule } from '../decks/decks.module';
import { CompleteLessonUseCase } from './application/use-cases/complete-lesson.use-case';
import { StartLessonUseCase } from './application/use-cases/start-lesson.use-case';
import { SubmitReviewUseCase } from './application/use-cases/submit-review.use-case';
import { CARD_REVIEW_STATE_REPOSITORY } from './application/ports/card-review-state-repository.port';
import { STUDY_SESSION_REPOSITORY } from './application/ports/study-session-repository.port';
import { PrismaCardReviewStateRepository } from './infrastructure/persistence/prisma-card-review-state.repository';
import { PrismaStudySessionRepository } from './infrastructure/persistence/prisma-study-session.repository';
import { LessonsResolver } from './presentation/graphql/resolvers/lessons.resolver';

@Module({
  imports: [AuthModule, DecksModule, AccountModule],
  providers: [
    {
      provide: CARD_REVIEW_STATE_REPOSITORY,
      useClass: PrismaCardReviewStateRepository,
    },
    {
      provide: STUDY_SESSION_REPOSITORY,
      useClass: PrismaStudySessionRepository,
    },
    StartLessonUseCase,
    SubmitReviewUseCase,
    CompleteLessonUseCase,
    LessonsResolver,
  ],
  exports: [
    CARD_REVIEW_STATE_REPOSITORY,
    STUDY_SESSION_REPOSITORY,
    StartLessonUseCase,
    SubmitReviewUseCase,
    CompleteLessonUseCase,
  ],
})
export class LessonsModule {}
