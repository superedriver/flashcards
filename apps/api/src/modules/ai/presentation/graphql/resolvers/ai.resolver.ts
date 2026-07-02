import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { GenerateCardExamplesUseCase } from '../../../application/use-cases/generate-card-examples.use-case';
import { SaveGeneratedCardExampleUseCase } from '../../../application/use-cases/save-generated-card-example.use-case';
import { GenerateCardExamplesInput } from '../inputs/generate-card-examples.input';
import { SaveGeneratedCardExampleInput } from '../inputs/save-generated-card-example.input';
import { GenerateCardExamplesPayloadType } from '../types/generate-card-examples-payload.type';
import { SaveGeneratedCardExamplePayloadType } from '../types/save-generated-card-example-payload.type';

@Resolver()
export class AiResolver {
  constructor(
    private readonly generateCardExamplesUseCase: GenerateCardExamplesUseCase,
    private readonly saveGeneratedCardExampleUseCase: SaveGeneratedCardExampleUseCase,
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

  @Mutation(() => SaveGeneratedCardExamplePayloadType)
  @UseGuards(GqlAuthGuard)
  async saveGeneratedCardExample(
    @CurrentUser() user: AuthUser,
    @Args('input') input: SaveGeneratedCardExampleInput,
  ): Promise<SaveGeneratedCardExamplePayloadType> {
    const result = await this.saveGeneratedCardExampleUseCase.execute({
      currentUser: user,
      cardId: input.cardId,
      exampleText: input.exampleText,
    });

    return { card: result.card };
  }
}
