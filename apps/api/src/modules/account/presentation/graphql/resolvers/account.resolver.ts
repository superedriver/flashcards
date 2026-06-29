import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { UserRole } from '../../../../auth/presentation/graphql/types/user-role.type';
import { GetMyAccountUseCase } from '../../../application/use-cases/get-my-account.use-case';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.use-case';
import { UpdateProfileInput } from '../inputs/update-profile.input';
import { MyAccountType } from '../types/my-account.type';
import { ThemePreference } from '../types/theme-preference.type';
import { UserProfileType } from '../types/user-profile.type';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly getMyAccountUseCase: GetMyAccountUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Query(() => MyAccountType)
  @UseGuards(GqlAuthGuard)
  async myAccount(@CurrentUser() user: AuthUser): Promise<MyAccountType> {
    const account = await this.getMyAccountUseCase.execute({ userId: user.id });

    return {
      user: {
        ...account.user,
        role: account.user.role as UserRole,
      },
      profile: account.profile,
      settings: {
        ...account.settings,
        themePreference: account.settings.themePreference as ThemePreference,
      },
    };
  }

  @Mutation(() => UserProfileType)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserProfileType> {
    return this.updateProfileUseCase.execute({
      userId: user.id,
      displayName: input.displayName,
      avatarUrl: input.avatarUrl,
    });
  }
}
