import { Module, forwardRef } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { DecksModule } from '../decks/decks.module';
import { LANGUAGE_REPOSITORY } from './application/ports/language-repository.port';
import { USER_STUDY_LANGUAGE_REPOSITORY } from './application/ports/user-study-language-repository.port';
import { AddStudyLanguageUseCase } from './application/use-cases/add-study-language.use-case';
import { ListLanguagesUseCase } from './application/use-cases/list-languages.use-case';
import { MyStudyLanguagesUseCase } from './application/use-cases/my-study-languages.use-case';
import { RemoveStudyLanguageUseCase } from './application/use-cases/remove-study-language.use-case';
import { SetActiveTargetLanguageUseCase } from './application/use-cases/set-active-target-language.use-case';
import { StudyLanguageRemovalImpactUseCase } from './application/use-cases/study-language-removal-impact.use-case';
import { PrismaLanguageRepository } from './infrastructure/persistence/prisma-language.repository';
import { PrismaUserStudyLanguageRepository } from './infrastructure/persistence/prisma-user-study-language.repository';
import { LanguagesResolver } from './presentation/graphql/resolvers/languages.resolver';
import { StudyLanguagesResolver } from './presentation/graphql/resolvers/study-languages.resolver';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => AccountModule),
    forwardRef(() => DecksModule),
  ],
  providers: [
    {
      provide: LANGUAGE_REPOSITORY,
      useClass: PrismaLanguageRepository,
    },
    {
      provide: USER_STUDY_LANGUAGE_REPOSITORY,
      useClass: PrismaUserStudyLanguageRepository,
    },
    ListLanguagesUseCase,
    MyStudyLanguagesUseCase,
    AddStudyLanguageUseCase,
    StudyLanguageRemovalImpactUseCase,
    RemoveStudyLanguageUseCase,
    SetActiveTargetLanguageUseCase,
    LanguagesResolver,
    StudyLanguagesResolver,
  ],
  exports: [
    LANGUAGE_REPOSITORY,
    USER_STUDY_LANGUAGE_REPOSITORY,
    ListLanguagesUseCase,
    MyStudyLanguagesUseCase,
    AddStudyLanguageUseCase,
    SetActiveTargetLanguageUseCase,
  ],
})
export class LanguagesModule {}
