import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { AddStudyLanguageUseCase } from '../../../application/use-cases/add-study-language.use-case';
import { CompleteStudyLanguageOnboardingUseCase } from '../../../application/use-cases/complete-study-language-onboarding.use-case';
import { MyStudyLanguagesUseCase } from '../../../application/use-cases/my-study-languages.use-case';
import { RemoveStudyLanguageUseCase } from '../../../application/use-cases/remove-study-language.use-case';
import { SetActiveTargetLanguageUseCase } from '../../../application/use-cases/set-active-target-language.use-case';
import { StudyLanguageRemovalImpactUseCase } from '../../../application/use-cases/study-language-removal-impact.use-case';
import { CompleteStudyLanguageOnboardingInput } from '../inputs/complete-study-language-onboarding.input';
import { CompleteStudyLanguageOnboardingPayloadType } from '../types/complete-study-language-onboarding-payload.type';
import { StudyLanguageRemovalImpactType } from '../types/study-language-removal-impact.type';
import { UserStudyLanguageType } from '../types/user-study-language.type';

@Resolver()
export class StudyLanguagesResolver {
  constructor(
    private readonly myStudyLanguagesUseCase: MyStudyLanguagesUseCase,
    private readonly addStudyLanguageUseCase: AddStudyLanguageUseCase,
    private readonly studyLanguageRemovalImpactUseCase: StudyLanguageRemovalImpactUseCase,
    private readonly removeStudyLanguageUseCase: RemoveStudyLanguageUseCase,
    private readonly setActiveTargetLanguageUseCase: SetActiveTargetLanguageUseCase,
    private readonly completeStudyLanguageOnboardingUseCase: CompleteStudyLanguageOnboardingUseCase,
  ) {}

  @Query(() => [UserStudyLanguageType])
  @UseGuards(GqlAuthGuard)
  async myStudyLanguages(
    @CurrentUser() user: AuthUser,
  ): Promise<UserStudyLanguageType[]> {
    return this.myStudyLanguagesUseCase.execute({
      currentUserId: user.id,
    });
  }

  @Query(() => StudyLanguageRemovalImpactType)
  @UseGuards(GqlAuthGuard)
  async studyLanguageRemovalImpact(
    @CurrentUser() user: AuthUser,
    @Args('languageCode') languageCode: string,
  ): Promise<StudyLanguageRemovalImpactType> {
    return this.studyLanguageRemovalImpactUseCase.execute({
      currentUserId: user.id,
      languageCode,
    });
  }

  @Mutation(() => UserStudyLanguageType)
  @UseGuards(GqlAuthGuard)
  async addStudyLanguage(
    @CurrentUser() user: AuthUser,
    @Args('languageCode') languageCode: string,
  ): Promise<UserStudyLanguageType> {
    return this.addStudyLanguageUseCase.execute({
      currentUserId: user.id,
      languageCode,
    });
  }

  @Mutation(() => [UserStudyLanguageType])
  @UseGuards(GqlAuthGuard)
  async removeStudyLanguage(
    @CurrentUser() user: AuthUser,
    @Args('languageCode') languageCode: string,
  ): Promise<UserStudyLanguageType[]> {
    return this.removeStudyLanguageUseCase.execute({
      currentUserId: user.id,
      languageCode,
    });
  }

  @Mutation(() => [UserStudyLanguageType])
  @UseGuards(GqlAuthGuard)
  async setActiveTargetLanguage(
    @CurrentUser() user: AuthUser,
    @Args('languageCode') languageCode: string,
  ): Promise<UserStudyLanguageType[]> {
    return this.setActiveTargetLanguageUseCase.execute({
      currentUserId: user.id,
      languageCode,
    });
  }

  @Mutation(() => CompleteStudyLanguageOnboardingPayloadType)
  @UseGuards(GqlAuthGuard)
  async completeStudyLanguageOnboarding(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CompleteStudyLanguageOnboardingInput,
  ): Promise<CompleteStudyLanguageOnboardingPayloadType> {
    return this.completeStudyLanguageOnboardingUseCase.execute({
      currentUserId: user.id,
      targetLanguage: input.targetLanguage,
      nativeLanguage: input.nativeLanguage,
    });
  }
}
