import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { UserRole } from '../../../../auth/presentation/graphql/types/user-role.type';
import { GetMyAccountUseCase } from '../../../application/use-cases/get-my-account.use-case';
import { MyAccountType } from '../types/my-account.type';
import { ThemePreference } from '../types/theme-preference.type';

@Resolver()
export class AccountResolver {
  constructor(private readonly getMyAccountUseCase: GetMyAccountUseCase) {}

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
}
