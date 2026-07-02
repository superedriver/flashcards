import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { RegisterPushTokenUseCase } from '../../../application/use-cases/register-push-token.use-case';
import { RemovePushTokenUseCase } from '../../../application/use-cases/remove-push-token.use-case';
import { RegisterPushTokenInput } from '../inputs/register-push-token.input';
import { RemovePushTokenInput } from '../inputs/remove-push-token.input';
import { RegisterPushTokenPayloadType } from '../types/register-push-token-payload.type';

@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly registerPushTokenUseCase: RegisterPushTokenUseCase,
    private readonly removePushTokenUseCase: RemovePushTokenUseCase,
  ) {}

  @Mutation(() => RegisterPushTokenPayloadType)
  @UseGuards(GqlAuthGuard)
  async registerPushToken(
    @CurrentUser() user: AuthUser,
    @Args('input') input: RegisterPushTokenInput,
  ): Promise<RegisterPushTokenPayloadType> {
    const result = await this.registerPushTokenUseCase.execute({
      currentUser: user,
      token: input.token,
      deviceId: input.deviceId,
      platform: input.platform,
    });

    return { success: result.success };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removePushToken(
    @CurrentUser() user: AuthUser,
    @Args('input') input: RemovePushTokenInput,
  ): Promise<boolean> {
    const result = await this.removePushTokenUseCase.execute({
      currentUser: user,
      token: input.token,
    });

    return result.success;
  }
}
