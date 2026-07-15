import { Module, forwardRef } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { DecksModule } from '../decks/decks.module';
import { GroupsModule } from '../groups/groups.module';
import { InternalJobGuard } from '../../common/guards/internal-job.guard';
import { DECK_PREVIEW_SESSION_REPOSITORY } from './application/ports/deck-preview-session-repository.port';
import { LANGUAGE_REPOSITORY } from './application/ports/language-repository.port';
import { USER_STUDY_LANGUAGE_REPOSITORY } from './application/ports/user-study-language-repository.port';
import { AddStudyLanguageUseCase } from './application/use-cases/add-study-language.use-case';
import { CancelDeckPreviewUseCase } from './application/use-cases/cancel-deck-preview.use-case';
import { CleanupExpiredDeckPreviewSessionsUseCase } from './application/use-cases/cleanup-expired-deck-preview-sessions.use-case';
import { CompleteStudyLanguageOnboardingUseCase } from './application/use-cases/complete-study-language-onboarding.use-case';
import { ConfirmDeckPreviewUseCase } from './application/use-cases/confirm-deck-preview.use-case';
import { GetActiveDeckPreviewUseCase } from './application/use-cases/get-active-deck-preview.use-case';
import { ListLanguagesUseCase } from './application/use-cases/list-languages.use-case';
import { MyStudyLanguagesUseCase } from './application/use-cases/my-study-languages.use-case';
import { RemoveStudyLanguageUseCase } from './application/use-cases/remove-study-language.use-case';
import { SetActiveTargetLanguageUseCase } from './application/use-cases/set-active-target-language.use-case';
import { StartDeckPreviewUseCase } from './application/use-cases/start-deck-preview.use-case';
import { StudyLanguageRemovalImpactUseCase } from './application/use-cases/study-language-removal-impact.use-case';
import { UpdateDeckPreviewCardUseCase } from './application/use-cases/update-deck-preview-card.use-case';
import { PrismaDeckPreviewSessionRepository } from './infrastructure/persistence/prisma-deck-preview-session.repository';
import { PrismaLanguageRepository } from './infrastructure/persistence/prisma-language.repository';
import { PrismaUserStudyLanguageRepository } from './infrastructure/persistence/prisma-user-study-language.repository';
import { LanguagesResolver } from './presentation/graphql/resolvers/languages.resolver';
import { StudyLanguagesResolver } from './presentation/graphql/resolvers/study-languages.resolver';
import { DeckPreviewResolver } from './presentation/graphql/resolvers/deck-preview.resolver';
import { InternalDeckPreviewController } from './presentation/http/internal-deck-preview.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => AccountModule),
    forwardRef(() => DecksModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => AiModule),
  ],
  controllers: [InternalDeckPreviewController],
  providers: [
    InternalJobGuard,
    {
      provide: LANGUAGE_REPOSITORY,
      useClass: PrismaLanguageRepository,
    },
    {
      provide: USER_STUDY_LANGUAGE_REPOSITORY,
      useClass: PrismaUserStudyLanguageRepository,
    },
    {
      provide: DECK_PREVIEW_SESSION_REPOSITORY,
      useClass: PrismaDeckPreviewSessionRepository,
    },
    ListLanguagesUseCase,
    MyStudyLanguagesUseCase,
    AddStudyLanguageUseCase,
    StudyLanguageRemovalImpactUseCase,
    RemoveStudyLanguageUseCase,
    SetActiveTargetLanguageUseCase,
    CompleteStudyLanguageOnboardingUseCase,
    CleanupExpiredDeckPreviewSessionsUseCase,
    StartDeckPreviewUseCase,
    UpdateDeckPreviewCardUseCase,
    ConfirmDeckPreviewUseCase,
    CancelDeckPreviewUseCase,
    GetActiveDeckPreviewUseCase,
    LanguagesResolver,
    StudyLanguagesResolver,
    DeckPreviewResolver,
  ],
  exports: [
    LANGUAGE_REPOSITORY,
    USER_STUDY_LANGUAGE_REPOSITORY,
    DECK_PREVIEW_SESSION_REPOSITORY,
    ListLanguagesUseCase,
    MyStudyLanguagesUseCase,
    AddStudyLanguageUseCase,
    SetActiveTargetLanguageUseCase,
    CompleteStudyLanguageOnboardingUseCase,
    CleanupExpiredDeckPreviewSessionsUseCase,
    StartDeckPreviewUseCase,
    UpdateDeckPreviewCardUseCase,
    ConfirmDeckPreviewUseCase,
    CancelDeckPreviewUseCase,
    GetActiveDeckPreviewUseCase,
  ],
})
export class LanguagesModule {}
