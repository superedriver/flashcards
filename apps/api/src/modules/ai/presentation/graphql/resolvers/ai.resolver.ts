import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { GenerateCardExamplesUseCase } from '../../../application/use-cases/generate-card-examples.use-case';
import { GenerateCardExamplesInput } from '../inputs/generate-card-examples.input';
import { GenerateCardExamplesPayloadType } from '../types/generate-card-examples-payload.type';

@Resolver()
export class AiResolver {
  constructor(
    private readonly generateCardExamplesUseCase: GenerateCardExamplesUseCase,
  ) {}

  @Mutation(() => GenerateCardExamplesPayloadType)
  @UseGuards(GqlAuthGuard)
  async generateCardExamples(
    @CurrentUser() user: AuthUser,
    @Args('input') input: GenerateCardExamplesInput,
  ): Promise<GenerateCardExamplesPayloadType> {
    return this.generateCardExamplesUseCase.execute({
      currentUser: user,
      cardId: input.cardId,
      locale: input.locale,
    });
  }
}
